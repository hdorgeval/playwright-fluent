import { chromium, Browser, firefox, webkit } from 'playwright';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export interface LaunchOptions {
  /**
   * Whether to run browser in headless mode.
   * Defaults to true
   *
   * @type {boolean}
   * @memberof LaunchOptions
   */
  headless: boolean;
  /**
   * Additional arguments to pass to the browser instance.
   * The list of Chromium flags can be found at
   * https://peter.sh/experiments/chromium-command-line-switches/
   *
   * @type {string[]}
   * @memberof LaunchOptions
   */
  args?: string[];
}
export const defaultLaunchOptions: LaunchOptions = {
  headless: true,
};
export async function launchBrowser(name: BrowserName, options: LaunchOptions): Promise<Browser> {
  switch (name) {
    case 'chromium': {
      const browser = await chromium.launch(options);
      return browser;
    }

    case 'firefox': {
      const browser = await firefox.launch(options);
      return browser;
    }

    case 'webkit': {
      const browser = await webkit.launch(options);
      return browser;
    }

    default:
      throw new Error(
        `Browser named '${name}' is unknown. It should be one of 'chromium', 'firefox', 'webkit'`,
      );
  }
}
