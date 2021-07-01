import {
  extractQueryStringObjectFromUrl,
  HttpHeaders,
  HttpRequestMethod,
  MimeType,
} from '../../../utils';
import { Page, Request } from 'playwright';
export type ResponseData = Record<string, unknown> | Record<string, never> | string | undefined;
export type PostData = Record<string, unknown> | string | undefined;
export type QueryString = Record<string, string>;

export interface FluentMock {
  displayName: string;
  urlMatcher: (url: string) => boolean;
  methodMatcher: (method: HttpRequestMethod) => boolean;
  queryStringMatcher: (queryString: QueryString) => boolean;
  postDataMatcher: (postData: PostData) => boolean;
  enrichResponseHeaders: (headers: HttpHeaders) => HttpHeaders;
  responseType: 'json' | 'string' | 'empty' | 'continue';
  status: number;

  jsonResponse: (requestInfos: {
    request: Request;
    queryString: QueryString;
    postData: PostData;
  }) => ResponseData;
  rawResponse: (requestInfos: {
    request: Request;
    queryString: QueryString;
    postData: PostData;
  }) => string;
}

const passthroughMock: FluentMock = {
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
  allMocks: () => Partial<FluentMock>[],
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
      const mocks = allMocks();
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
      const mocks = allMocks();
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

      throw new Error(`mock with response type '${mock.responseType}' is not yet implemented`);
    },
  );
}
