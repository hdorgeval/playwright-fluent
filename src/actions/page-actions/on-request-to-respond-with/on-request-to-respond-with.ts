import { HttpHeaders } from '../../../utils';
import { Page, Request } from 'playwright';

export interface MockResponse<T> {
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

function buildPlaywrightResponseWith<T>(mockedResponse: Partial<MockResponse<T>>): {
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
function buildHeadersFrom<T>(mockedResponse: Partial<MockResponse<T>>): HttpHeaders {
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

function buildContentTypeFrom<T>(mockedResponse: Partial<MockResponse<T>>): string {
  if (mockedResponse.contentType) {
    return mockedResponse.contentType;
  }

  if (typeof mockedResponse.body === 'string') {
    return 'text/plain';
  }

  return 'application/json';
}

export async function onRequestToRespondWith<T>(
  url: string,
  response: Partial<MockResponse<T>> | ((request: Request) => Partial<MockResponse<T>>),
  bypassPredicate: (request: Request) => boolean,
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
      if (bypassPredicate(request)) {
        route.continue();
        return;
      }
      const mockedResponse = typeof response === 'function' ? response(request) : response;
      const playwrightResponse = buildPlaywrightResponseWith(mockedResponse);
      route.fulfill(playwrightResponse);
    },
  );
}
