import { Page } from 'playwright';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isCI = require('is-ci') as boolean;

export async function pause(page: Page | undefined): Promise<void> {
  if (!page) {
    throw new Error(`Cannot pause because no browser has been launched`);
  }

  if (!page.pause) {
    // eslint-disable-next-line no-console
    console.warn('page.pause() method only exists in playwright version 1.9.0');
    return;
  }

  if (isCI) {
    // eslint-disable-next-line no-console
    console.warn('page.pause() method is ignored on CI');
    return;
  }

  await page.pause();
}
