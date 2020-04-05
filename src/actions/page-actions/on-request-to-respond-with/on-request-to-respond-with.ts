import { Page } from 'playwright';

export interface MockResponse<T> {
  status: number;
  headers: {
    [key: string]: string;
  };
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

export async function onRequestToRespondWith<T>(
  url: string,
  response: Partial<MockResponse<T>>,
  page: Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot intercept requests to '${url}' because no browser has been launched`);
  }

  const playwrightResponse: {
    status: number;
    headers: {
      [key: string]: string;
    };
    contentType: string;
    body: string | Buffer;
  } = {
    headers: response.headers || {},
    contentType: response.contentType || 'application/json',
    status: response.status || 200,
    body: serializeBody(response.body),
  };

  await page.route(
    (uri) => {
      return uri.toString().includes(url);
    },
    (route) => {
      route.fulfill(playwrightResponse);
    },
  );
}
