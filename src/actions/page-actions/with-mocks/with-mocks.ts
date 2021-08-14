import {
  extractQueryStringObjectFromUrl,
  HttpHeaders,
  HttpRequestMethod,
  MimeType,
} from '../../../utils';
import { Page, Request, Route } from 'playwright';

export type ResponseData =
  | Record<string, unknown>
  | Record<string, never>
  | string
  | undefined
  | unknown;
export type PostData = Record<string, unknown> | string | undefined | null | unknown;
export type QueryString = Record<string, string>;

export interface RequestInfos {
  request: Request;
  queryString: QueryString;
  postData: PostData;
  sharedContext: unknown;
}

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
   * Optional predicate acting on the shared context.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a contextMatcher, a default one that always returns true is provided.
   * A mock can update the shared context on any method passing a {@link RequestInfos} object.
   * A context matcher should be used when the mock response depends on the requests history,
   * for example when the mock must respond only to the nth request given by the urlMatcher.
   *
   * @memberof FluentMock
   */
  contextMatcher: (context: unknown) => boolean;

  /**
   * Add or modify the headers that will be sent with the mocked response.
   *
   * @memberof FluentMock
   */
  enrichResponseHeaders: (headers: HttpHeaders) => HttpHeaders;

  /**
   * Define the response type of the mocked request.
   * If you do not set a responseType, a default one will be infered from the provided jsonResponse or rawResponse.
   *
   * @type {('json' | 'string' | 'javascript' | 'empty' | 'continue')}
   * @memberof FluentMock
   */
  responseType: 'json' | 'string' | 'javascript' | 'empty' | 'continue';

  /**
   * Http response status. Can be a function that returns a number.
   * defaults to 200.
   *
   * @memberof FluentMock
   */
  status: number | ((requestInfos: RequestInfos) => number);

  /**
   * Build your own json response.
   * This method will be called only if responseType is 'json'.
   * @memberof FluentMock
   */
  jsonResponse: (requestInfos: RequestInfos) => ResponseData;

  /**
   * Build your own string response.
   * This method will be called only if responseType is 'string' or 'javascript'.
   *
   * @memberof FluentMock
   */
  rawResponse: (requestInfos: RequestInfos) => string;

  /**
   * Delay the response by the given number of milliseconds.
   * Defaults to 0.
   *
   * @type {number}
   * @memberof FluentMock
   */
  delayInMilliseconds: number;

  /**
   * Optional callback to update the data source of the mocked response.
   * When provided, this method will be called automatically when the mock is found to be outdated by the helper (see `getOutdatedMocks`).
   * @memberof FluentMock
   */
  updateData: (requestInfos: RequestInfos, response: ResponseData) => void;
}

export function noopVoidFunc(): void {
  // do nothing
}

export function getPostDataOf(request: Request): PostData {
  try {
    return request.postDataJSON();
  } catch (error) {
    return request.postData();
  }
}

export const passthroughMock: FluentMock = {
  displayName: 'passthroughMock',
  urlMatcher: () => true,
  methodMatcher: () => true,
  queryStringMatcher: () => true,
  postDataMatcher: () => true,
  contextMatcher: () => true,
  enrichResponseHeaders: (headers: HttpHeaders) => headers,
  responseType: 'continue',
  status: 200,
  jsonResponse: () => {
    return {};
  },
  rawResponse: () => '',
  delayInMilliseconds: 0,
  updateData: noopVoidFunc,
};

export interface WithMocksOptions {
  onMockFound: (mock: Partial<FluentMock>, requestInfos: RequestInfos) => void;
  onMockNotFound: (requestInfos: RequestInfos) => void;
  onInternalError: (error: Error, mock: Partial<FluentMock>, requestInfos: RequestInfos) => void;
}

export const defaultMocksOptions: WithMocksOptions = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMockNotFound: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMockFound: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onInternalError: () => {},
};

export function getMockStatus(mock: Partial<FluentMock>, requestInfos: RequestInfos): number {
  if (typeof mock.status === 'function') {
    return mock.status(requestInfos);
  }
  if (typeof mock.status === 'number') {
    return mock.status;
  }

  return 200;
}

export function inferMockResponseTypeIfNeeded(mock: Partial<FluentMock>): Partial<FluentMock> {
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

export function spreadMissingProperties(mock: Partial<FluentMock>): FluentMock {
  return { ...passthroughMock, displayName: 'not set', ...mock };
}

export interface RouteOptions {
  /**
   * Response body.
   */
  body: string | Buffer;

  /**
   * If set, equals to setting `Content-Type` response header.
   */
  contentType: string;

  /**
   * Response headers. Header values will be converted to a string.
   */
  headers: { [key: string]: string };

  /**
   * File path to respond with. The content type will be inferred from file extension. If `path` is a relative path, then it
   * is resolved relative to the current working directory.
   */
  path: string;

  /**
   * Response status code, defaults to `200`.
   */
  status: number;
}

async function fullfillRouteWithMock(
  mock: FluentMock,
  route: Route,
  options: Partial<RouteOptions>,
): Promise<void> {
  if (mock.delayInMilliseconds > 0) {
    setTimeout(() => route.fulfill(options), mock.delayInMilliseconds);
    return;
  }

  route.fulfill(options);
}

export async function withMocks(
  mocks: () => Partial<FluentMock>[],
  context: () => unknown,
  options: Partial<WithMocksOptions>,
  page: Page | undefined,
): Promise<void> {
  if (typeof mocks !== 'function') {
    throw new Error(`mocks must be a function that returns an array of FluentMock objects.`);
  }

  if (!Array.isArray(mocks())) {
    throw new Error(`mocks must be a function that returns an array of FluentMock objects.`);
  }

  if (!page) {
    throw new Error(`Cannot intercept requests with mocks because no browser has been launched`);
  }

  const mockOptions: WithMocksOptions = {
    ...defaultMocksOptions,
    ...options,
  };

  await page.route(
    (uri) => {
      if (mocks().length === 0) {
        return false;
      }

      const mockExists = mocks()
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
      const postData = getPostDataOf(request);
      const sharedContext = context();

      const mock = mocks()
        .map(inferMockResponseTypeIfNeeded)
        .map(spreadMissingProperties)
        .filter((mock) => mock.urlMatcher(url))
        .filter((mock) => mock.methodMatcher(requestMethod))
        .filter((mock) => mock.queryStringMatcher(queryString))
        .filter((mock) => mock.postDataMatcher(postData))
        .filter((mock) => mock.contextMatcher(sharedContext))
        .pop();

      if (!mock) {
        mockOptions.onMockNotFound({ request, queryString, postData, sharedContext });
        route.continue();
        return;
      }

      if (mock.responseType === 'continue' && mock.delayInMilliseconds === 0) {
        route.continue();
        return;
      }

      if (mock.responseType === 'continue' && mock.delayInMilliseconds > 0) {
        setTimeout(() => route.continue(), mock.delayInMilliseconds);
        return;
      }

      if (mock.responseType === 'json') {
        const responseObject = mock.jsonResponse({ request, queryString, postData, sharedContext });
        const headers = mock.enrichResponseHeaders({
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
        });
        const status = getMockStatus(mock, { request, queryString, postData, sharedContext });
        const body = JSON.stringify(responseObject);
        const contentType: MimeType = 'application/json';
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        fullfillRouteWithMock(mock, route, { status, headers, contentType, body });
        return;
      }

      if (mock.responseType === 'string') {
        const headers = mock.enrichResponseHeaders({
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
        });
        const status = getMockStatus(mock, { request, queryString, postData, sharedContext });
        const body = mock.rawResponse({ request, queryString, postData, sharedContext });
        const contentType: MimeType = 'text/plain';
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        fullfillRouteWithMock(mock, route, { status, headers, contentType, body });
        return;
      }

      if (mock.responseType === 'empty') {
        const headers = mock.enrichResponseHeaders({
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
        });
        const status = getMockStatus(mock, { request, queryString, postData, sharedContext });
        const body = '';
        const contentType: MimeType = 'text/plain';
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        fullfillRouteWithMock(mock, route, { status, headers, contentType, body });
        return;
      }

      if (mock.responseType === 'javascript') {
        const headers = mock.enrichResponseHeaders({
          'access-control-allow-methods': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
        });
        const status = getMockStatus(mock, { request, queryString, postData, sharedContext });
        const body = mock.rawResponse({ request, queryString, postData, sharedContext });
        const contentType: MimeType = 'application/javascript';
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        fullfillRouteWithMock(mock, route, { status, headers, contentType, body });
        return;
      }

      throw new Error(`mock with response type '${mock.responseType}' is not yet implemented`);
    },
  );
}
