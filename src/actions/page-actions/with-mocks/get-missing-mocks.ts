import {
  FluentMock,
  getPostDataOf,
  inferMockResponseTypeIfNeeded,
  PostData,
  QueryString,
  RequestInfos,
  spreadMissingProperties,
} from './with-mocks';
import { validateMock } from './validate-mock';
import { extractQueryStringObjectFromUrl, HttpRequestMethod, MimeType } from '../../../utils';
import { Request } from 'playwright';

export interface MissingMock {
  url: string;
  method: HttpRequestMethod;
  queryString: QueryString;
  postData: PostData;
  mimeType: MimeType;
  response: string | unknown | null;
  status: number;
}
export async function getMissingMocks(
  mocks: Partial<FluentMock>[],
  requests: Request[],
  sharedContext: unknown = {},
): Promise<MissingMock[]> {
  const result: MissingMock[] = [];

  if (requests.length === 0) {
    throw new Error('No requests provided. Maybe you forgot to record requests.');
  }

  mocks.forEach(validateMock);

  for (let index = 0; index < requests.length; index++) {
    const request = requests[index];
    const method = request.method() as HttpRequestMethod;
    const url = request.url();
    const queryString = extractQueryStringObjectFromUrl(url) as QueryString;
    const postData = getPostDataOf(request);
    const requestResponse = await request.response();
    const requestInfos: RequestInfos = { request, queryString, postData, sharedContext };

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
      .filter((mock) => mock.methodMatcher(method))
      .filter((mock) => mock.queryStringMatcher(queryString))
      .filter((mock) => mock.postDataMatcher(postData))
      .filter((mock) => mock.contextMatcher(sharedContext))
      .filter((mock) => mock.customMatcher(requestInfos))
      .pop();

    if (mock) {
      // TODO : get the response from the mock because it might change the shared context
      continue;
    }

    const mimeType = requestResponse.headers()['content-type'] as MimeType;
    const status = requestResponse.status();

    try {
      const response = await requestResponse.json();
      result.push({
        url,
        method,
        mimeType,
        postData,
        queryString,
        status,
        response,
      });
      continue;
      // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
      const response = await requestResponse.text();
      result.push({
        url,
        method,
        mimeType,
        postData,
        queryString,
        status,
        response,
      });
      continue;
      // eslint-disable-next-line no-empty
    } catch (error) {}

    result.push({
      url,
      method,
      mimeType,
      postData,
      queryString,
      status,
      response: null,
    });
  }

  return result;
}
