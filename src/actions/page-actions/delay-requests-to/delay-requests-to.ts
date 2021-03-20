import { sleep } from '../../../utils';
import { Page } from 'playwright';

export async function delayRequestsTo(
  url: string,
  delayInSeconds: number,
  page: Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot delay requests to '${url}' because no browser has been launched`);
  }

  await page.route(
    (uri) => {
      return uri.toString().includes(url);
    },
    async (route) => {
      await sleep(delayInSeconds * 1000);
      await route.continue();
    },
  );
}
