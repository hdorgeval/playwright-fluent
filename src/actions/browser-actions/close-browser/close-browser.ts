import { Browser } from 'playwright';

export async function closeBrowser(browser: Browser | undefined): Promise<void> {
  if (browser === undefined) {
    return;
  }
  await browser.close();
}
