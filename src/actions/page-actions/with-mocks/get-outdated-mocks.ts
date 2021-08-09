import {
  defaultMocksOptions,
  FluentMock,
  getMockStatus,
  inferMockResponseTypeIfNeeded,
  QueryString,
  spreadMissingProperties,
  WithMocksOptions,
} from './with-mocks';
import { validateMock } from './validate-mock';
import { areSameType, extractQueryStringObjectFromUrl, HttpRequestMethod } from '../../../utils';
import { Request } from 'playwright';

function isJson(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch (e) {
    return false;
  }
}

export interface OutdatedMock {
  url: string;
  mock: Partial<FluentMock>;
  actualResponse: string | unknown;
  mockedResponse: string | unknown;
}
/**
 * Get outdated mocks from the given unintercepted requests.
 * If a mock is found to be outdated and has provided a method to update its data source,
 * then the update method will be called, so that the mock can update itself the data source of the mocked response.
 * @export
 * @param {Partial<FluentMock>[]} mocks
 * @param {Request[]} requests
 * @param {Partial<WithMocksOptions>} options
 * @returns {Promise<OutdatedMock[]>}
 */
export async function getOutdatedMocks(
  mocks: Partial<FluentMock>[],
  requests: Request[],
  options: Partial<WithMocksOptions>,
): Promise<OutdatedMock[]> {
  const mockOptions: WithMocksOptions = {
    ...defaultMocksOptions,
    ...options,
  };

  const result: OutdatedMock[] = [];
  if (!Array.isArray(mocks)) {
    return [];
  }

  if (mocks.length === 0) {
    return [];
  }

  if (requests.length === 0) {
    throw new Error('No requests provided. Maybe you forgot to record requests.');
  }

  mocks.forEach(validateMock);

  for (let index = 0; index < requests.length; index++) {
    const request = requests[index];
    const requestMethod = request.method() as HttpRequestMethod;
    const url = request.url();
    const queryString = extractQueryStringObjectFromUrl(url) as QueryString;
    const postData = request.postDataJSON();
    const requestResponse = await request.response();

    if (!requestResponse) {
      continue;
    }

    const requestStatus = requestResponse.status();
    if (requestStatus >= 300) {
      continue;
    }

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
      continue;
    }

    if (mock.responseType === 'continue') {
      continue;
    }

    const mockedStatus = getMockStatus(mock, { request, queryString, postData });
    if (mockedStatus >= 300) {
      continue;
    }

    if (mock.responseType === 'json') {
      try {
        const mockedResponse = mock.jsonResponse({ request, queryString, postData });
        const actualResponse = await requestResponse.json();
        mockOptions.onMockFound(mock, { request, queryString, postData });
        const isOutdated = !areSameType(mockedResponse, actualResponse);
        if (isOutdated) {
          result.push({
            url,
            mock,
            actualResponse,
            mockedResponse,
          });
          mock.updateData({ request, queryString, postData }, actualResponse);
        }
      } catch (error) {
        mockOptions.onInternalError(error, mock, { request, queryString, postData });
      }

      continue;
    }

    if (mock.responseType === 'string' || mock.responseType === 'empty') {
      try {
        const mockedBody = mock.rawResponse({ request, queryString, postData });
        const actualBody = await requestResponse.text();
        mockOptions.onMockFound(mock, { request, queryString, postData });
        if (isJson(actualBody)) {
          result.push({
            url,
            mock,
            actualResponse: actualBody,
            mockedResponse: mockedBody,
          });
          mock.updateData({ request, queryString, postData }, actualBody);
        }
      } catch (error) {
        mockOptions.onInternalError(error, mock, { request, queryString, postData });
      }

      continue;
    }

    if (mock.responseType === 'javascript') {
      try {
        const mockedBody = mock.rawResponse({ request, queryString, postData });
        const actualBody = await requestResponse.text();
        mockOptions.onMockFound(mock, { request, queryString, postData });
        const isOutdated = mockedBody !== actualBody;
        if (isOutdated) {
          result.push({
            url,
            mock,
            actualResponse: actualBody,
            mockedResponse: mockedBody,
          });
          mock.updateData({ request, queryString, postData }, actualBody);
        }
      } catch (error) {
        mockOptions.onInternalError(error, mock, { request, queryString, postData });
      }

      continue;
    }
  }

  return result;
}
