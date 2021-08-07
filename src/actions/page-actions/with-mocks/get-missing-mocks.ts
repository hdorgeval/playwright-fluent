import {
  FluentMock,
  inferMockResponseTypeIfNeeded,
  PostData,
  QueryString,
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
  response: string | unknown;
  status: number;
}
export async function getMissingMocks(
  mocks: Partial<FluentMock>[],
  requests: Request[],
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
      .filter((mock) => mock.methodMatcher(method))
      .filter((mock) => mock.queryStringMatcher(queryString))
      .filter((mock) => mock.postDataMatcher(postData))
      .pop();

    if (mock) {
      continue;
    }

    const mimeType = requestResponse.headers()['content-type'] as MimeType;
    const status = requestResponse.status();
    let response: string | unknown = '';
    try {
      response = await requestResponse.json();
    } catch (error) {
      response = await requestResponse.text();
    }

    result.push({
      url,
      method,
      mimeType,
      postData,
      queryString,
      status,
      response,
    });
  }

  return result;
}
