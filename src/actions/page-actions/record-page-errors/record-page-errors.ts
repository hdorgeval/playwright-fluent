import { Page } from 'playwright';

export async function recordPageErrors(
  page: Page | undefined,
  callback: (error: Error) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot record page errors because no browser has been launched`);
  }

  page.on('pageerror', (err) => {
    callback(err);
  });
}
