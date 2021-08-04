import { FluentMock, QueryString } from './with-mocks';
export function mockGetWithJsonResponse<T>(relativeUrl: string, response: T): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    jsonResponse: () => response,
  };
}

/**
 * Ceate a mock for a GET request to the specified url that returns a JavaScript response.
 *
 * @export
 * @param {string} relativeUrl
 * @param {string} response
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
): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    responseType: 'javascript',
    rawResponse: () => response,
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
 * * @example
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
 * * @example
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

export function mockGetWithJsonResponseDependingOnQueryString<T>(
  relativeUrl: string,
  queryString: QueryString,
  response: T,
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
  };
}
