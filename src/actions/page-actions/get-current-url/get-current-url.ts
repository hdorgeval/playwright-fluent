import { Frame, Page } from 'playwright';
declare const window: Window;

export async function getCurrentUrl(page: Page | Frame | undefined): Promise<string> {
  if (page) {
    try {
      const url = await page.evaluate(() => window.location.href);
      return url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `An internal error has occured in Playwright API while evaluating current url : `,
        error,
      );
      return `${error}`;
    }
  }
  throw new Error('Cannot get current page url because no browser has been launched');
}
