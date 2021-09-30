import { FluentMock, QueryString, RequestInfos, ResponseData } from './with-mocks';
import { MissingMock } from './get-missing-mocks';
import {
  ensureDirectoryExists,
  hasNoQueryString,
  UpdatePolicy,
  urlToShortPath,
} from '../../../utils';
import path from 'path';
import { writeFileSync } from 'fs';

export interface UpdatePolicyOptions {
  /**
   * callback to update the data source of the mocked response.
   * When provided, this method will be called automatically when
   *  1°) the mock is found to be outdated by the helper {@link getOutdatedMocks})
   *  2°) and the call to {@link lastUpdated} gives a date that is older than the {@link updatePolicy}
   * @memberof FluentMock
   */
  updateData: (requestInfos: RequestInfos, response: ResponseData) => void;

  /**
   * Optional callback to get the last update of the data source used to mock the response.
   * This method will be called automatically when the mock is found to be outdated by the helper {@link getOutdatedMocks})
   * Defaults to the current date.
   *
   * @type {Date}
   * @memberof FluentMock
   */
  lastUpdated?: () => Date;

  /**
   * Update policy for the data source of the mocked response.
   * Defaults to 'always'.
   *
   * @type {UpdatePolicy}
   * @memberof FluentMock
   */
  updatePolicy?: UpdatePolicy;
}

/**
 * Ceate a mock for a GET request to the specified url that returns a JSON response.
 *
 * @export
 * @template T
 * @param {string} relativeUrl
 * @param {T} response - The JSON response to return.
 * @param {UpdatePolicyOptions} [updatePolicy]
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
  updatePolicy?: UpdatePolicyOptions,
): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    jsonResponse: () => response,
    ...updatePolicy,
  };
}

/**
 * Ceate a mock for a GET request to the specified url that returns a JavaScript response.
 *
 * @export
 * @param {string} relativeUrl
 * @param {string} response - The JavaScript response to return.
 * @param {UpdatePolicyOptions} [updatePolicy]
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
  updatePolicy?: UpdatePolicyOptions,
): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    responseType: 'javascript',
    rawResponse: () => response,
    ...updatePolicy,
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
 * @param {UpdatePolicyOptions} [updatePolicy]
 * @returns {Partial<FluentMock>}
 * @example
 * const mock = mockGetWithJsonResponseDependingOnQueryString('/api/v1/yo', { foo: 'bar' }, response);
 * // will mock any request to /api/v1/yo whose query string contains ?foo=bar
 */
export function mockGetWithJsonResponseDependingOnQueryString<T>(
  relativeUrl: string,
  queryString: QueryString,
  response: T,
  updatePolicy?: UpdatePolicyOptions,
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
    ...updatePolicy,
  };
}
export function generateCodeForMissingMock(
  missingMock: MissingMock,
  targetDirectory: string,
): void {
  ensureDirectoryExists(targetDirectory);
  const targetFolderName = urlToShortPath(missingMock.url).replace(/\//g, '_').replace(/\?/g, '#');
  const targetSubDirectory = path.join(targetDirectory, targetFolderName);
  ensureDirectoryExists(targetSubDirectory);
  switch (missingMock.mimeType) {
    case 'application/json':
      {
        const dataFileName = `${targetFolderName}.json`;
        const dataFilePath = path.join(targetSubDirectory, dataFileName);
        writeFileSync(dataFilePath, JSON.stringify(missingMock.response, null, 2));
        const mockSourceCode = generateMockCodeOf(missingMock, dataFileName);
        writeFileSync(path.join(targetSubDirectory, `${targetFolderName}.ts`), mockSourceCode);
      }
      break;

    default:
      // eslint-disable-next-line no-console
      console.log(`Unsupported mime type: ${missingMock.mimeType}`);
      break;
  }
}

export function generateMockCodeOf(missingMock: MissingMock, dataFileName: string): string {
  if (
    missingMock.mimeType === 'application/json' &&
    missingMock.method === 'GET' &&
    hasNoQueryString(missingMock.url)
  ) {
    return `
    import response from './${dataFileName}';
    export const mock = mockGetWithJsonResponse('${missingMock.url}', response)
    `;
  }

  return `Unsupported mime type: ${missingMock.mimeType}`;
}
