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

  page.on('requestfinished', async (request) => {
    const response = await request.response();
    if (response === null) {
      const typedRequest = (request as unknown) as Request;
      callback(typedRequest);
      return;
    }

    const status = response.status();
    if (failedStatus.includes(status)) {
      const typedRequest = (request as unknown) as Request;
      callback(typedRequest);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    const typedRequest = (request as unknown) as Request;
    callback(typedRequest);
    return;
  });
}
