import { Frame, Page } from 'playwright';
declare const window: Window;

export async function getCurrentUrl(page: Page | Frame | undefined): Promise<string> {
  if (page) {
    const url = await page.evaluate(() => window.location.href);
    return url;
  }
  throw new Error('Cannot get current page url because no browser has been launched');
}
