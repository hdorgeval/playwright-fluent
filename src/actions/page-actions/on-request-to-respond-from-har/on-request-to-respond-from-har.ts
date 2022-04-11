import { Page, Request, Route } from 'playwright';
import {
  areQueryStringSimilar,
  getHarDataFrom,
  HarEntry,
  HarHeader,
  harHeadersToHttpHeaders,
  HarPostData,
  hasQueryString,
  HttpHeaders,
  HttpRequestMethod,
  urlToPathWithoutQueryString,
} from '../../../utils';

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
   * By default entries are filtered by comparing the urls without the hostname and without the query string
   * @memberof HarRequestResponseOptions
   */
  filterHarEntryByUrl: (requestUrl: string, harRequestUrl: string, index: number) => boolean;

  /**
   * Optional filter that enables you to select the HAR entries for the given requested postdata
   * By default entries are filtered by checking equality of postdata
   * @memberof HarRequestResponseOptions
   */
  filterHarEntryByPostData: (
    requestPostData: string | null,
    harRequestPostData: HarPostData,
    index: number,
  ) => boolean;

  /**
   * Optional filter that enables you to select the HAR entries for the given requested url and query string
   *
   * @memberof HarRequestResponseOptions
   */
  filterHarEntryByQueryString: (
    requestUrl: string,
    harRequestUrl: string,
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
  onHarEntryNotFound: (
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
  onHarEntryFound: (
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

  /**
   * Optional callback that will enable you to handle yourself the request interception
   * in case the internal implementation did not found any entry in the provided HAR files.
   * By default route.continue() will be called.
   *
   * @memberof HarRequestResponseOptions
   */
  handleRouteOnHarEntryNotFound: (route: Route, request: Request, entries: HarEntry[]) => void;

  /**
   * Optional callback that enables you to provide yourself an HAR entry for the given requested
   * when the internal implementation did not found any entry.
   *
   * @memberof HarRequestResponseOptions
   */
  provideEntryOnHarEntryNotFound: (request: Request, entries: HarEntry[]) => HarEntry | null;
}

export const defaultHarRequestResponseOptions: HarRequestResponseOptions = {
  filterAllHarEntriesBeforeProcessing: () => true,
  bypassRequestPredicate: () => false,
  filterHarEntryByUrl: (requestUrl, harRequestUrl) =>
    urlToPathWithoutQueryString(requestUrl) === urlToPathWithoutQueryString(harRequestUrl),
  filterHarEntryByResponseStatus: (status) => status >= 200 && status < 300,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  selectEntryFromFoundHarEntries: (entries) => entries.pop()!,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHarEntryNotFound: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHarEntryFound: () => {},
  enrichResponseHeaders: (headers) => headers,
  filterHarEntryByPostData: (requestPostData, harPostData) => requestPostData === harPostData.text,
  filterHarEntryByQueryString: (requestUrl, harRequestUrl) =>
    areQueryStringSimilar(requestUrl, harRequestUrl),
  handleRouteOnHarEntryNotFound: (route) => route.continue(),
  provideEntryOnHarEntryNotFound: () => null,
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
          options.filterHarEntryByUrl(entry.request.url, requestedUrl, index),
        )
        .filter((entry) => entry.response)
        .filter((entry) => options.filterHarEntryByResponseStatus(entry.response.status))
        .filter((entry, index) => {
          if (hasQueryString(requestedUrl) && hasQueryString(entry.request.url)) {
            return options.filterHarEntryByQueryString(requestedUrl, entry.request.url, index);
          }
          return true;
        })
        .filter((entry, index) => {
          if (!entry.request.postData && !requestedPostData) {
            return true;
          }

          if (entry.request.postData && requestedPostData !== null) {
            return options.filterHarEntryByPostData(
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
        const providedEntry = options.provideEntryOnHarEntryNotFound(request, allEntries);
        if (providedEntry) {
          entries.push(providedEntry);
        }
      }

      if (entries.length === 0) {
        options.onHarEntryNotFound(allEntries, requestedUrl, httpMethod);
        options.handleRouteOnHarEntryNotFound(route, request, allEntries);
        return;
      }

      let foundEntry = entries[0];
      if (entries.length > 1) {
        foundEntry = options.selectEntryFromFoundHarEntries(entries, requestedUrl);
      }

      options.onHarEntryFound(foundEntry, requestedUrl, httpMethod);

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
