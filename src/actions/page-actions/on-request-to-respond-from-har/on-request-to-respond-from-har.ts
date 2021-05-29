import {
  getHarDataFrom,
  HarEntry,
  HarHeader,
  harHeadersToHttpHeaders,
  HarPostData,
  HttpHeaders,
  HttpRequestMethod,
  urlToPath,
} from '../../../utils';
import { Page, Request } from 'playwright';

function getAllHarEntries(harFiles: string[]): HarEntry[] {
  const entries: HarEntry[] = [];
  harFiles.forEach((harFile) => {
    const harData = getHarDataFrom(harFile);
    entries.push(...harData.log.entries);
  });

  return entries;
}

export interface HarRequestResponseOptions {
  /**
   * Optional filter to take only a subset of all available HAR entries
   * By default all HAR entries found in the provided HAR files are taken
   * @memberof HarRequestResponseOptions
   */
  filterAllHarEntriesBeforeProcessing: (entry: HarEntry, index: number) => boolean;

  /**
   * Optional Predicate used to bypass request interception for specific requests.
   * By default all requests that match the given url are intercepted.
   * @memberof HarRequestResponseOptions
   */
  bypassRequestPredicate: (request: Request) => boolean;

  /**
   * Optional filter that enables you to select the HAR entries for the given requested Url
   * By default entries are filtered by comparing the urls without the hostname
   * @memberof HarRequestResponseOptions
   */
  filterHarEntryByRequestUrl: (requestUrl: string, harRequestUrl: string, index: number) => boolean;

  /**
   * Optional filter that enables you to select the HAR entries for the given requested postdata
   * By default entries are filtered by checking equality of postdata
   * @memberof HarRequestResponseOptions
   */
  filterHarEntryByRequestPostData: (
    requestPostData: string | null,
    harRequestPostData: HarPostData,
    index: number,
  ) => boolean;

  /**
   * Optional filter that enables you to select the HAR entries with a specific response status
   *
   * @memberof HarRequestResponseOptions
   */
  filterHarEntryByResponseStatus: (status: number) => boolean;

  /**
   * Optional selector to let you select one HAR entry when several HAR entries have been found.
   * By default the last HAR entry is taken.
   *
   * @memberof HarRequestResponseOptions
   */
  selectEntryFromFoundHarEntries: (entries: HarEntry[], requestedUrl: string) => HarEntry;

  /**
   * Optional callback that will enable you to diagnose why no HAR entry has been found regarding a specific request url.
   * You should not mutate any given parameters
   *
   * @memberof HarRequestResponseOptions
   */
  onHarEntryNotFoundForRequestedUrl: (
    allEntries: HarEntry[],
    requestedUrl: string,
    requestedMethod: HttpRequestMethod,
  ) => void;

  /**
   * Optional callback that will enable you to check the correct HAR entry has been selected regarding a specific request url.
   * You should not mutate any given parameters
   *
   * @memberof HarRequestResponseOptions
   */
  onHarEntryFoundForRequestedUrl: (
    foundEntry: HarEntry,
    requestedUrl: string,
    requestedMethod: HttpRequestMethod,
  ) => void;

  /**
   * Optional callback that will enable you to add/remove/update the headers that will be provided in the response object
   * By default all headers found in the HAR entry will be used to serve the response.
   *
   * @memberof HarRequestResponseOptions
   */
  enrichResponseHeaders: (headers: HttpHeaders) => HttpHeaders;
}

export const defaultHarRequestResponseOptions: HarRequestResponseOptions = {
  filterAllHarEntriesBeforeProcessing: () => true,
  bypassRequestPredicate: () => false,
  filterHarEntryByRequestUrl: (requestUrl, harRequestUrl) =>
    urlToPath(requestUrl) === urlToPath(harRequestUrl),
  filterHarEntryByResponseStatus: (status) => status >= 200 && status < 300,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  selectEntryFromFoundHarEntries: (entries) => entries.pop()!,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHarEntryNotFoundForRequestedUrl: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHarEntryFoundForRequestedUrl: () => {},
  enrichResponseHeaders: (headers) => headers,
  filterHarEntryByRequestPostData: (requestPostData, harPostData) =>
    requestPostData === harPostData.text,
};

export async function onRequestToRespondFromHar(
  url: string,
  harFiles: string[],
  page: Page | undefined,
  options: HarRequestResponseOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot intercept requests to '${url}' because no browser has been launched`);
  }

  if (!Array.isArray(harFiles)) {
    throw new Error(
      `Cannot intercept requests to '${url}' because no HAR file(s) has been provided. You must provide HAR file(s) inside an array.`,
    );
  }

  if (Array.isArray(harFiles) && harFiles.length === 0) {
    throw new Error(
      `Cannot intercept requests to '${url}' because no HAR file(s) has been provided. You must provide at least one HAR file.`,
    );
  }

  const allEntries = getAllHarEntries(harFiles).filter(options.filterAllHarEntriesBeforeProcessing);

  await page.route(
    (uri) => {
      return uri.toString().includes(url);
    },
    (route, request) => {
      if (options.bypassRequestPredicate(request)) {
        route.continue();
        return;
      }

      const httpMethod = request.method() as HttpRequestMethod;
      const requestedUrl = request.url();
      const requestedPostData = request.postData();

      const entries = allEntries
        .filter((entry) => entry.request.method === httpMethod)
        .filter((entry, index) =>
          options.filterHarEntryByRequestUrl(entry.request.url, requestedUrl, index),
        )
        .filter((entry) => entry.response)
        .filter((entry) => options.filterHarEntryByResponseStatus(entry.response.status))
        .filter((entry, index) => {
          if (!entry.request.postData && !requestedPostData) {
            return true;
          }

          if (entry.request.postData && requestedPostData !== null) {
            return options.filterHarEntryByRequestPostData(
              requestedPostData,
              entry.request.postData,
              index,
            );
          }

          switch (httpMethod) {
            case 'CONNECT':
            case 'GET':
            case 'HEAD':
            case 'OPTIONS':
            case 'TRACE':
            case 'DELETE':
              return true;
            default:
              return false;
          }
        });

      if (entries.length === 0) {
        options.onHarEntryNotFoundForRequestedUrl(allEntries, requestedUrl, httpMethod);
        route.continue();
        return;
      }

      let foundEntry = entries[0];
      if (entries.length > 1) {
        foundEntry = options.selectEntryFromFoundHarEntries(entries, requestedUrl);
      }

      options.onHarEntryFoundForRequestedUrl(foundEntry, requestedUrl, httpMethod);

      const headers = buildHeadersFrom(foundEntry.response.headers);
      const enrichedHeaders = options.enrichResponseHeaders(headers);

      route.fulfill({
        headers: enrichedHeaders,
        status: foundEntry.response.status,
        contentType: foundEntry.response.content.mimeType,
        body:
          foundEntry.response.content.encoding === 'base64'
            ? Buffer.from(foundEntry.response.content.text, 'base64')
            : foundEntry.response.content.text,
      });
      return;
    },
  );
}

function buildHeadersFrom(harHeaders: HarHeader[]): HttpHeaders {
  const headers = harHeadersToHttpHeaders(harHeaders);

  if (!hasAccessControlAllowCredentialsHeader(headers)) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  if (!hasAccessControlAllowOriginHeader(headers)) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

function hasAccessControlAllowCredentialsHeader(headers: HttpHeaders): boolean {
  if (headers['access-control-allow-credentials']) {
    return true;
  }

  if (headers['Access-Control-Allow-Credentials']) {
    return true;
  }

  return false;
}

function hasAccessControlAllowOriginHeader(headers: HttpHeaders): boolean {
  if (headers['access-control-allow-origin']) {
    return true;
  }

  if (headers['Access-Control-Allow-Origin']) {
    return true;
  }

  return false;
}
