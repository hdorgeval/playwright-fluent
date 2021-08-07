import { FluentMock, noopVoidFunc, QueryString, RequestInfos, ResponseData } from './with-mocks';

/**
 * Ceate a mock for a GET request to the specified url that returns a JSON response.
 *
 * @export
 * @template T
 * @param {string} relativeUrl
 * @param {T} response - The JSON response to return.
 * @param {(requestInfos: RequestInfos, response: ResponseData) => void} [onOutdated=noopVoidFunc] - Optional callback to update the data source of the mocked response.
 * When provided, this method will be called automatically when the mock is found to be outdated by the helper (see `getOutdatedMocks`).
 * @returns {Partial<FluentMock>}
 * @example
 * It will return this mock:
 * {
 *   displayName: `GET ${relativeUrl}`,
 *   urlMatcher: (url) => url.includes(relativeUrl),
 *   methodMatcher: (m) => m === 'GET',
 *   jsonResponse: () => response,
 * }
 */
export function mockGetWithJsonResponse<T>(
  relativeUrl: string,
  response: T,
  onOutdated: (requestInfos: RequestInfos, response: ResponseData) => void = noopVoidFunc,
): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    jsonResponse: () => response,
    updateData: onOutdated,
  };
}

/**
 * Ceate a mock for a GET request to the specified url that returns a JavaScript response.
 *
 * @export
 * @param {string} relativeUrl
 * @param {string} response - The JavaScript response to return.
 * @param {(requestInfos: RequestInfos, response: ResponseData) => void} onOutdated - Optional callback to update the data source of the mocked response.
 * When provided, this method will be called automatically when the mock is found to be outdated by the helper (see `getOutdatedMocks`).
 * @returns {Partial<FluentMock>}
 * @example
 * It will return this mock:
 * {
 *   displayName: `GET ${relativeUrl}`,
 *   urlMatcher: (url) => url.includes(relativeUrl),
 *   methodMatcher: (m) => m === 'GET',
 *   responseType: 'javascript',
 *   rawResponse: () => response,
 * }
 *
 */
export function mockGetWithJavascriptResponse(
  relativeUrl: string,
  response: string,
  onOutdated: (requestInfos: RequestInfos, response: ResponseData) => void = noopVoidFunc,
): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    responseType: 'javascript',
    rawResponse: () => response,
    updateData: onOutdated,
  };
}

export function mockGetWithEmptyResponseAndStatus(
  relativeUrl: string,
  status = 200,
): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    responseType: 'empty',
    status,
  };
}

/**
 * Ceate a mock for a GET request to the specified url that returns an HTTP 401 status.
 *
 * @export
 * @param {string} relativeUrl
 * @returns {Partial<FluentMock>}
 * @example
 * It will return this mock:
 * {
 *  displayName: `GET ${relativeUrl}`,
 *  urlMatcher: (url) => url.includes(relativeUrl),
 *  methodMatcher: (m) => m === 'GET',
 *  responseType: 'empty',
 *  status: 401,
 * }
 */
export function mockGetWithUnauthorizedResponse(relativeUrl: string): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    responseType: 'empty',
    status: 401,
  };
}

/**
 * Ceate a mock for a GET request to the specified url that returns an HTTP 403 status.
 *
 * @export
 * @param {string} relativeUrl
 * @returns {Partial<FluentMock>}
 * @example
 * It will return this mock:
 * {
 *  displayName: `GET ${relativeUrl}`,
 *  urlMatcher: (url) => url.includes(relativeUrl),
 *  methodMatcher: (m) => m === 'GET',
 *  responseType: 'empty',
 *  status: 403,
 * }
 */
export function mockGetWithForbiddenResponse(relativeUrl: string): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    responseType: 'empty',
    status: 403,
  };
}

export function mockPostWithEmptyResponseAndStatus(
  relativeUrl: string,
  status = 200,
): Partial<FluentMock> {
  return {
    displayName: `POST ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'POST',
    responseType: 'empty',
    status,
  };
}

/**
 * Ceate a mock for a GET request to the specified url that returns a JSON response depending on the query string
 *
 * @export
 * @template T
 * @param {string} relativeUrl - The url to mock
 * @param {QueryString} queryString - The query string to match against the url.
 * @param {T} response - The JSON response to return.
 * @param {(requestInfos: RequestInfos, response: ResponseData) => void} [onOutdated=noopVoidFunc] - Optional callback to update the data source of the mocked response.
 * When provided, this method will be called automatically when the mock is found to be outdated by the helper (see `getOutdatedMocks`).
 * @returns {Partial<FluentMock>}
 * @example
 * const mock = mockGetWithJsonResponseDependingOnQueryString('/api/v1/yo', { foo: 'bar' }, response);
 * // will mock any request to /api/v1/yo whose query string contains ?foo=bar
 */
export function mockGetWithJsonResponseDependingOnQueryString<T>(
  relativeUrl: string,
  queryString: QueryString,
  response: T,
  onOutdated: (requestInfos: RequestInfos, response: ResponseData) => void = noopVoidFunc,
): Partial<FluentMock> {
  const searchParams = new URLSearchParams(queryString);
  return {
    displayName: `GET ${relativeUrl}?${searchParams.toString()}`,
    methodMatcher: (m) => m === 'GET',
    urlMatcher: (url) => url.includes(relativeUrl),
    queryStringMatcher: (qs) => {
      let match = true;
      for (const key in queryString) {
        if (qs && qs[key] === undefined) {
          match = false;
          break;
        }
        if (qs && qs[key] && qs[key] !== queryString[key]) {
          match = false;
          break;
        }
      }
      return match;
    },
    jsonResponse: () => response,
    updateData: onOutdated,
  };
}
