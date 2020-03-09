import { Request } from '../record-requests-to';
import { Page } from 'playwright';

const failedStatus = [500, 503, 400, 401, 403, 307];

export async function recordFailedRequests(
  page: Page | undefined,
  callback: (request: Request) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot record failed requests because no browser has been launched`);
  }

  page.on('requestfinished', (request) => {
    const response = request.response();
    if (response === null) {
      callback(request);
      return;
    }

    const status = response.status();
    if (failedStatus.includes(status)) {
      callback(request);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    callback(request);
  });
}
