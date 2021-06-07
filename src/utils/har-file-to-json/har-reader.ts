import { urlToPath } from '../url';
import { Request } from 'playwright';

export type HttpRequestMethod =
  | 'CONNECT'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'TRACE';

export type MimeType =
  | 'application/javascript'
  | 'application/json'
  | 'application/json; charset=UTF-8'
  | 'application/x-www-form-urlencoded; charset=UTF-8'
  | 'font/woff2'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/png'
  | 'image/vnd.microsoft.icon'
  | 'image/webp'
  | 'text/css'
  | 'text/html; charset=utf-8'
  | 'text/html'
  | 'text/javascript'
  | 'text/plain';

export interface HarPage {
  startedDateTime: string;
  id: string;
  title: string;
}

export interface HarEntry {
  startedDateTime: string;
  request: HarRequest;
  response: HarResponse;
}

export interface HarRequest {
  method: HttpRequestMethod;
  url: string;
  headers: HarHeader[];
  queryString: NameValue[];
  postData: HarPostData;
}

export interface HarPostData {
  mimeType: MimeType;
  text: string;
}

export interface HarHeader {
  name: string;
  value: string;
}

export interface NameValue {
  name: string;
  value: string;
}

export interface HarResponse {
  status: number;
  statusText: string;
  httpVersion: string;
  headers: HarHeader[];
  content: {
    mimeType: MimeType;
    text: string;
    encoding: 'base64';
  };
}

export interface HarData {
  log: {
    version: string;
    creator: {
      name: string;
      version: string;
    };
    browser: {
      name: string;
      version: string;
    };
    pages: HarPage[];
    entries: HarEntry[];
  };
}

export function extractQueryStringObjectFromHarQueryString(harQueryString: NameValue[]): {
  [key: string]: string;
} {
  const result: { [key: string]: string } = {};
  harQueryString.forEach((keyValue) => {
    if (keyValue.value) {
      const params = new URLSearchParams(`${keyValue.name}=${keyValue.value}`);
      result[keyValue.name] = params.get(keyValue.name) ?? keyValue.value;
    }
  });

  return result;
}

export function areUrlEquals(url1: string, url2: string): boolean {
  return urlToPath(url1) === urlToPath(url2);
}
export interface HarEntryParserOptions {
  areUrlEquals: (url1: string, url2: string) => boolean;
}

export const defaultHarEntryParserOptions: HarEntryParserOptions = {
  areUrlEquals,
};
export function getHarEntryFor(
  request: Request,
  harData: HarData,
  options: Partial<HarEntryParserOptions> = defaultHarEntryParserOptions,
): HarEntry | undefined {
  const entryOptions = {
    ...defaultHarEntryParserOptions,
    ...options,
  };

  const httpMethod = request.method() as HttpRequestMethod;
  const url = request.url();

  const entries = harData.log.entries
    .filter((entry) => entry.request.method === httpMethod)
    .filter((entry) => entryOptions.areUrlEquals(entry.request.url, url))
    .filter((entry) => entry.response)
    .filter((entry) => entry.response.status >= 200 && entry.response.status < 300);

  const entriesWithSamePostData = entries.filter(
    (entry) =>
      entry.request.postData?.text === request.postData() ||
      (request.postData() === null && entry.request.postData?.text === undefined),
  );

  switch (httpMethod) {
    case 'CONNECT':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'TRACE':
      return entries.pop();

    case 'DELETE':
    case 'PATCH':
    case 'POST':
    case 'PUT':
      return entriesWithSamePostData.pop();

    default:
      throw new Error(`HAR-READER: the HTTP Method ${httpMethod} is not yet implemented`);
  }
}

export function getHarResponseFor(
  request: Request,
  harData: HarData,
  options: Partial<HarEntryParserOptions> = defaultHarEntryParserOptions,
): HarResponse | undefined {
  const harEntry = getHarEntryFor(request, harData, options);
  return harEntry?.response;
}
