import {
  defaultMocksOptions,
  FluentMock,
  getMockStatus,
  getPostDataOf,
  inferMockResponseTypeIfNeeded,
  QueryString,
  RequestInfos,
  spreadMissingProperties,
  WithMocksOptions,
} from './with-mocks';
import { validateMock } from './validate-mock';
import {
  areSameType,
  extractQueryStringObjectFromUrl,
  HttpRequestMethod,
  shouldUpdate,
} from '../../../utils';
import { Request } from 'playwright';

function isJson(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch (e) {
    return false;
  }
}

function shouldUpdateMock(mock: FluentMock): boolean {
  const lastUpdated = mock.lastUpdated();
  const updatePolicy = mock.updatePolicy;
  return shouldUpdate(lastUpdated, updatePolicy);
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
 * @param {unknown} [sharedContext={}]
 * @returns {Promise<OutdatedMock[]>}
 */
export async function getOutdatedMocks(
  mocks: Partial<FluentMock>[],
  requests: Request[],
  options: Partial<WithMocksOptions>,
  sharedContext: unknown = {},
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
    const postData = getPostDataOf(request);
    const requestInfos: RequestInfos = { request, queryString, postData, sharedContext };

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
      .filter((mock) => mock.contextMatcher(sharedContext))
      .filter((mock) => mock.customMatcher(requestInfos))
      .pop();

    if (!mock) {
      mockOptions.onMockNotFound({ request, queryString, postData, sharedContext });
      continue;
    }

    if (mock.responseType === 'continue') {
      continue;
    }

    const mockedStatus = getMockStatus(mock, { request, queryString, postData, sharedContext });
    if (mockedStatus >= 300) {
      continue;
    }

    if (mock.responseType === 'json') {
      try {
        const mockedResponse = mock.jsonResponse({ request, queryString, postData, sharedContext });
        const actualResponse = await requestResponse.json();
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        const isOutdated = !areSameType(mockedResponse, actualResponse);
        if (isOutdated && shouldUpdateMock(mock)) {
          result.push({
            url,
            mock,
            actualResponse,
            mockedResponse,
          });
          mock.updateData({ request, queryString, postData, sharedContext }, actualResponse);
        }
      } catch (error) {
        mockOptions.onInternalError(error as Error, mock, {
          request,
          queryString,
          postData,
          sharedContext,
        });
      }

      continue;
    }

    if (mock.responseType === 'string' || mock.responseType === 'empty') {
      try {
        const mockedBody = mock.rawResponse({ request, queryString, postData, sharedContext });
        const actualBody = await requestResponse.text();
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        if (isJson(actualBody) && shouldUpdateMock(mock)) {
          result.push({
            url,
            mock,
            actualResponse: actualBody,
            mockedResponse: mockedBody,
          });
          mock.updateData({ request, queryString, postData, sharedContext }, actualBody);
        }
      } catch (error) {
        mockOptions.onInternalError(error as Error, mock, {
          request,
          queryString,
          postData,
          sharedContext,
        });
      }

      continue;
    }

    if (mock.responseType === 'javascript') {
      try {
        const mockedBody = mock.rawResponse({ request, queryString, postData, sharedContext });
        const actualBody = await requestResponse.text();
        mockOptions.onMockFound(mock, { request, queryString, postData, sharedContext });
        const isOutdated = mockedBody !== actualBody;
        if (isOutdated && shouldUpdateMock(mock)) {
          result.push({
            url,
            mock,
            actualResponse: actualBody,
            mockedResponse: mockedBody,
          });
          mock.updateData({ request, queryString, postData, sharedContext }, actualBody);
        }
      } catch (error) {
        mockOptions.onInternalError(error as Error, mock, {
          request,
          queryString,
          postData,
          sharedContext,
        });
      }

      continue;
    }
  }

  return result;
}
