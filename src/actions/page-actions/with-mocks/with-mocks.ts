import {
  extractQueryStringObjectFromUrl,
  HttpHeaders,
  HttpRequestMethod,
  MimeType,
} from '../../../utils';
import { Page, Request } from 'playwright';
export type ResponseData =
  | Record<string, unknown>
  | Record<string, never>
  | string
  | undefined
  | unknown;
export type PostData = Record<string, unknown> | string | undefined;
export type QueryString = Record<string, string>;

/**
 * Be able to intercept a given http request url and provide a mocked response.
 * The mock will be selected only if all provided matchers return true.
 * When a matcher is not provided, it always default to true.
 * When multiple mocks are selected, the last one is taken (like in CSS):
 *  this enables you to override existing mocks on specific conditions.
 * @export
 * @interface FluentMock
 */
export interface FluentMock {
  /**
   * Mock friendly name. Useful when you are debugging your mocks.
   * By default it will be set to 'not set' if you forgot to give your mock a name.
   * @type {string}
   * @memberof FluentMock
   */
  displayName: string;

  /**
   * Predicate acting on the http request url.
   * If you return true for the input url, then the request will be mocked accordingly to the responseType.
   * If you return false, the the request will never be mocked and other matchers will never be called.
   * @memberof FluentMock
   */
  urlMatcher: (url: string) => boolean;

  /**
   * Optional predicate acting on the http request method.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a methodMatcher, a default one that always returns true is provided.
   * @memberof FluentMock
   */
  methodMatcher: (method: HttpRequestMethod) => boolean;

  /**
   * Optional predicate acting on the query string.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a queryStringMatcher, a default one that always returns true is provided.
   *
   * @memberof FluentMock
   */
  queryStringMatcher: (queryString: QueryString) => boolean;

  /**
   * Optional predicate acting on the post data sent by the http request.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a postDataMatcher, a default one that always returns true is provided.
   *
   * @memberof FluentMock
   */
  postDataMatcher: (postData: PostData) => boolean;

  /**
   * Add or modify the headers that will be sent with the mocked response.
   *
   * @memberof FluentMock
   */
  enrichResponseHeaders: (headers: HttpHeaders) => HttpHeaders;
  responseType: 'json' | 'string' | 'empty' | 'continue';
  status: number;

  /**
   * Build your own json response.
   * This method will be called only if responseType is 'json'.
   * @memberof FluentMock
   */
  jsonResponse: (requestInfos: {
    request: Request;
    queryString: QueryString;
    postData: PostData;
  }) => ResponseData;

  /**
   * Build your own string response.
   * This method will be called only if responseType is 'string'.
   *
   * @memberof FluentMock
   */
  rawResponse: (requestInfos: {
    request: Request;
    queryString: QueryString;
    postData: PostData;
  }) => string;
}

export const passthroughMock: FluentMock = {
  displayName: 'passthroughMock',
  urlMatcher: () => true,
  methodMatcher: () => true,
  queryStringMatcher: () => true,
  postDataMatcher: () => true,
  enrichResponseHeaders: (headers: HttpHeaders) => headers,
  responseType: 'continue',
  status: 200,
  jsonResponse: () => {
    return {};
  },
  rawResponse: () => '',
};

export interface WithMocksOptions {
  onMockNotFound: (requestInfos: {
    request: Request;
    queryString: QueryString;
    postData: PostData;
  }) => void;
  onMockFound: (
    mock: Partial<FluentMock>,
    requestInfos: {
      request: Request;
      queryString: QueryString;
      postData: PostData;
    },
  ) => void;
}

export const defaultMocksOptions: WithMocksOptions = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMockNotFound: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMockFound: () => {},
};

function inferMockResponseTypeIfNeeded(mock: Partial<FluentMock>): Partial<FluentMock> {
  if (mock.responseType) {
    return mock;
  }

  if (typeof mock.jsonResponse === 'function' && typeof mock.rawResponse !== 'function') {
    return {
      ...mock,
      responseType: 'json',
    };
  }

  if (typeof mock.rawResponse === 'function' && typeof mock.jsonResponse !== 'function') {
    return {
      ...mock,
      responseType: 'string',
    };
  }

  if (typeof mock.rawResponse !== 'function' && typeof mock.jsonResponse !== 'function') {
    return {
      ...mock,
      responseType: 'empty',
    };
  }

  return mock;
}

function validate(mock: Partial<FluentMock>): void {
  if (typeof mock.rawResponse === 'function' && typeof mock.jsonResponse === 'function') {
    throw new Error(
      `mock named '${mock.displayName}' should either implement a json response or a raw response but not both.`,
    );
  }
}

function spreadMissingProperties(mock: Partial<FluentMock>): FluentMock {
  return { ...passthroughMock, displayName: 'not set', ...mock };
}

export async function withMocks(
  mocks: Partial<FluentMock>[],
  options: Partial<WithMocksOptions>,
  page: Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot intercept requests with mocks because no browser has been launched`);
  }

  const mockOptions: WithMocksOptions = {
    ...defaultMocksOptions,
    ...options,
  };
  await page.route(
    (uri) => {
      if (!Array.isArray(mocks)) {
        return false;
      }

      if (mocks.length === 0) {
        return false;
      }

      mocks.forEach(validate);

      const mockExists = mocks
        .map(inferMockResponseTypeIfNeeded)
        .map(spreadMissingProperties)
        .map((mock) => mock.urlMatcher(uri.toString()))
        .some((match) => match === true);
      return mockExists;
    },
    (route, request) => {
      const requestMethod = request.method() as HttpRequestMethod;
      const url = request.url();
      const queryString = extractQueryStringObjectFromUrl(url) as QueryString;
      const postData = request.postDataJSON();
      mocks.forEach(validate);
      const mock = mocks
        .map(inferMockResponseTypeIfNeeded)
        .map(spreadMissingProperties)
        .filter((mock) => mock.urlMatcher(url))
        .filter((mock) => mock.methodMatcher(requestMethod))
        .filter((mock) => mock.queryStringMatcher(queryString))
        .filter((mock) => mock.postDataMatcher(postData))
        .pop();

      if (!mock) {
        mockOptions.onMockNotFound({ request, queryString, postData });
        route.continue();
        return;
      }

      if (mock.responseType === 'continue') {
        route.continue();
        return;
      }

      if (mock.responseType === 'json') {
        const responseObject = mock.jsonResponse({ request, queryString, postData });
        const headers = mock.enrichResponseHeaders({
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
        });
        const status = mock.status;
        const body = JSON.stringify(responseObject);
        const contentType: MimeType = 'application/json';
        mockOptions.onMockFound(mock, { request, queryString, postData });
        route.fulfill({
          status,
          headers,
          contentType,
          body,
        });
        return;
      }

      if (mock.responseType === 'string') {
        const headers = mock.enrichResponseHeaders({
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
        });
        const status = mock.status;
        const body = mock.rawResponse({ request, queryString, postData });
        const contentType: MimeType = 'text/plain';
        mockOptions.onMockFound(mock, { request, queryString, postData });
        route.fulfill({
          status,
          headers,
          contentType,
          body,
        });
        return;
      }

      throw new Error(`mock with response type '${mock.responseType}' is not yet implemented`);
    },
  );
}
