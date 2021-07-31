import {
  defaultMocksOptions,
  FluentMock,
  getMockStatus,
  inferMockResponseTypeIfNeeded,
  QueryString,
  spreadMissingProperties,
  validateMock,
  WithMocksOptions,
} from './with-mocks';
import { areSameType, extractQueryStringObjectFromUrl, HttpRequestMethod } from '../../../utils';
import { Request } from 'playwright';

export interface OutdatedMock {
  url: string;
  mock: Partial<FluentMock>;
  actualResponse: string | unknown;
  mockedResponse: string | unknown;
}
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

    if (mock.responseType === 'continue' && mock.delayInMilliseconds === 0) {
      continue;
    }

    const mockedStatus = getMockStatus(mock, { request, queryString, postData });
    if (mockedStatus >= 300) {
      continue;
    }

    if (mock.responseType === 'json') {
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
      }
      continue;
    }

    if (mock.responseType === 'string') {
      const mockedBody = mock.rawResponse({ request, queryString, postData });
      const actualBody = await requestResponse.text();
      mockOptions.onMockFound(mock, { request, queryString, postData });
      try {
        JSON.parse(actualBody);
        result.push({
          url,
          mock,
          actualResponse: actualBody,
          mockedResponse: mockedBody,
        });
        // eslint-disable-next-line no-empty
      } catch (error) {}
      continue;
    }

    throw new Error(`mock with response type '${mock.responseType}' is not yet implemented`);
  }

  return result;
}
