import { Page, Request } from 'playwright';
export async function recordRequestsTo(
  partialUrl: string,
  ignorePredicate: (request: Request) => boolean,
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
    const shouldIgnoreRequest = ignorePredicate(request);
    if (shouldIgnoreRequest) {
      return;
    }
    if (requestedUrl && requestedUrl.includes(partialUrl)) {
      callback(request);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    const requestedUrl = request.url();
    const shouldIgnoreRequest = ignorePredicate(request);
    if (shouldIgnoreRequest) {
      return;
    }
    if (requestedUrl && requestedUrl.includes(partialUrl)) {
      callback(request);
      return;
    }
  });
}
