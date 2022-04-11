import { Page, Request } from 'playwright';
import { HttpHeaders, HttpRequestMethod } from '../../../utils';

export interface MockedResponse<T> {
  status: number;
  headers: HttpHeaders;
  contentType: string;
  body: T;
}

function serializeBody<T>(body: T): string | Buffer {
  if (typeof body === 'string') {
    return body as string;
  }

  try {
    return JSON.stringify(body, null, 2);
  } catch (error) {
    const buffer = body as unknown as Buffer;
    return buffer;
  }
}

function buildPlaywrightResponseWith<T>(mockedResponse: Partial<MockedResponse<T>>): {
  status: number;
  headers: HttpHeaders;
  contentType: string;
  body: string | Buffer;
} {
  return {
    headers: buildHeadersFrom(mockedResponse),
    contentType: buildContentTypeFrom(mockedResponse),
    status: mockedResponse.status || 200,
    body: serializeBody(mockedResponse.body),
  };
}
function buildHeadersFrom<T>(mockedResponse: Partial<MockedResponse<T>>): HttpHeaders {
  const headers = {
    ...mockedResponse.headers,
  };

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

function buildContentTypeFrom<T>(mockedResponse: Partial<MockedResponse<T>>): string {
  if (mockedResponse.contentType) {
    return mockedResponse.contentType;
  }

  if (typeof mockedResponse.body === 'string') {
    return 'text/plain';
  }

  return 'application/json';
}

export interface RequestInterceptionFilterOptions {
  /**
   * Intercepts only requests with the given method (GET, POST, ...).
   * By default all requests to the given url are intercepted for every HTTP verbs
   *
   * @type {HttpRequestMethod}
   * @memberof RequestInterceptionFilterOptions
   */
  method?: HttpRequestMethod;
  /**
   * Predicate that will enable you to bypass request interception on custom conditions
   *
   * @memberof RequestInterceptionFilterOptions
   */
  bypassPredicate?: (request: Request) => boolean;
}

export async function onRequestToRespondWith<T>(
  url: string,
  options: Partial<RequestInterceptionFilterOptions>,
  response: Partial<MockedResponse<T>> | ((request: Request) => Partial<MockedResponse<T>>),
  page: Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot intercept requests to '${url}' because no browser has been launched`);
  }

  await page.route(
    (uri) => {
      return uri.toString().includes(url);
    },
    (route, request) => {
      const requestMethod = request.method();
      if (options && typeof options.method === 'string' && options.method !== requestMethod) {
        route.continue();
        return;
      }

      if (
        options &&
        typeof options.bypassPredicate === 'function' &&
        options.bypassPredicate(request)
      ) {
        route.continue();
        return;
      }

      const mockedResponse = typeof response === 'function' ? response(request) : response;
      const playwrightResponse = buildPlaywrightResponseWith(mockedResponse);
      route.fulfill(playwrightResponse);
    },
  );
}
