import { Page } from 'playwright';

export interface Request {
  url(): string;
  method(): string;
  postData(): string | undefined | null;
  headers(): {
    [key: string]: string;
  };
  response(): Promise<Response | null>;
  failure(): {
    errorText: string;
  } | null;
}

export interface Response {
  url(): string;
  ok(): boolean;
  status(): number;
  statusText(): string;
  headers(): {
    [key: string]: string;
  };
  buffer(): Promise<Buffer>;
  text(): Promise<string>;
  json(): Promise<Record<string, unknown>>;
}
export async function recordRequestsTo(
  partialUrl: string,
  page: Page | undefined,
  callback: (request: Request) => void,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot record requests to '${partialUrl}' because no browser has been launched`,
    );
  }

  page.on('requestfinished', (request) => {
    const requestedUrl = request.url();
    if (requestedUrl && requestedUrl.includes(partialUrl)) {
      const typedRequest = (request as unknown) as Request;
      callback(typedRequest);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    const requestedUrl = request.url();
    if (requestedUrl && requestedUrl.includes(partialUrl)) {
      const typedRequest = (request as unknown) as Request;
      callback(typedRequest);
      return;
    }
  });
}
