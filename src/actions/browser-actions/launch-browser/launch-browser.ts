import { chromium, Browser, firefox, webkit } from 'playwright';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';
export async function launchBrowser(name: BrowserName): Promise<Browser> {
  switch (name) {
    case 'chromium': {
      const browser = await chromium.launch();
      return browser;
    }

    case 'firefox': {
      const browser = await firefox.launch();
      return browser;
    }

    case 'webkit': {
      const browser = await webkit.launch();
      return browser;
    }

    default:
      throw new Error(
        `Browser named '${name}' is unknown. It should be one of 'chromium', 'firefox', 'webkit'`,
      );
  }
}
