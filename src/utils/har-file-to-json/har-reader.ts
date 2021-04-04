import { HarData, HarEntry, HarResponse } from './har-file-to-json';
import { Request } from 'playwright';
import { URL } from 'url';

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

export function urlToPath(url: string): string {
  const urlObject = new URL(url);
  const fullPath = `${urlObject.pathname}${urlObject.search}`;
  return fullPath;
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
