import { Page, Request, Response } from 'playwright';

const failedStatus = [500, 503, 400, 401, 403, 307];

export async function recordFailedRequests(
  page: Page | undefined,
  callback: (request: Request) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot record failed requests because no browser has been launched`);
  }

  page.on('requestfinished', async (request) => {
    let response: Response | null = null;
    try {
      response = await request.response();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        'Cannot evaluate the response from request due to the following error : ',
        error,
      );
      return;
    }

    if (response === null) {
      const typedRequest = request as unknown as Request;
      callback(typedRequest);
      return;
    }

    const status = response.status();
    if (failedStatus.includes(status)) {
      const typedRequest = request as unknown as Request;
      callback(typedRequest);
      return;
    }
  });

  page.on('requestfailed', (request) => {
    const typedRequest = request as unknown as Request;
    callback(typedRequest);
    return;
  });
}
