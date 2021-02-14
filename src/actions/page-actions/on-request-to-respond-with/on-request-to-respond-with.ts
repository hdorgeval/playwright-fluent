import { Page, Request } from 'playwright';

export type Headers = {
  [key: string]: string;
};

export interface MockResponse<T> {
  status: number;
  headers: Headers;
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
    const buffer = (body as unknown) as Buffer;
    return buffer;
  }
}

function buildPlaywrightResponseWith<T>(
  mockedResponse: Partial<MockResponse<T>>,
): {
  status: number;
  headers: Headers;
  contentType: string;
  body: string | Buffer;
} {
  return {
    headers: mockedResponse.headers || {},
    contentType: buildContentTypeFrom(mockedResponse),
    status: mockedResponse.status || 200,
    body: serializeBody(mockedResponse.body),
  };
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
      const mockedResponse = typeof response === 'function' ? response(request) : response;
      const playwrightResponse = buildPlaywrightResponseWith(mockedResponse);
      route.fulfill(playwrightResponse);
    },
  );
}
