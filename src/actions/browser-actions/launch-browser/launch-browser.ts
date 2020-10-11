import { getChromePath, getChromeCanaryPath } from '../../../utils';
import { chromium, Browser, firefox, webkit } from 'playwright';

export type BrowserName = 'chromium' | 'chrome' | 'chrome-canary' | 'firefox' | 'webkit';

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

  /**
   * If specified, accepted downloads are downloaded into this folder. Otherwise, temporary folder is created and is deleted when browser is closed.
   *
   * @type {string}
   * @memberof LaunchOptions
   */
  downloadsPath?: string;

  /**
   * Path to a browser executable to run instead of the bundled one.
   *
   * @type {string}
   * @memberof LaunchOptions
   */
  executablePath?: string;
  /**
   * Maximum time in milliseconds to wait for the browser instance to start. Defaults to 30000 (30 seconds). Pass 0 to disable timeout.
   *
   * @type {number}
   * @memberof LaunchOptions
   */
  timeout?: number;

  /**
   * Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
   *
   * @type {number}
   * @memberof LaunchOptions
   */
  slowMo?: number;
  proxy?: {
    /**
     * Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example http://myproxy.com:3128 or socks5://myproxy.com:3128. Short form myproxy.com:3128 is considered an HTTP proxy.
     *
     * @type {string}
     */
    server: string;

    /**
     * coma-separated domains to bypass proxy, for example ".com, chromium.org, .domain.com".
     *
     * @type {string}
     */
    bypass?: string;

    /**
     * username to use if HTTP proxy requires authentication.
     *
     * @type {string}
     */
    username?: string;

    /**
     * password to use if HTTP proxy requires authentication.
     *
     * @type {string}
     */
    password?: string;
  };
}
export const defaultLaunchOptions: LaunchOptions = {
  headless: true,
};
export async function launchBrowser(name: BrowserName, options: LaunchOptions): Promise<Browser> {
  switch (name) {
    case 'chrome': {
      if (options && options.executablePath !== undefined) {
        const browser = await chromium.launch(options);
        return browser;
      }
      {
        const chromeOptions: LaunchOptions = {
          ...options,
          executablePath: getChromePath(),
        };
        const browser = await chromium.launch(chromeOptions);
        return browser;
      }
    }

    case 'chrome-canary': {
      if (options && options.executablePath !== undefined) {
        const browser = await chromium.launch(options);
        return browser;
      }
      {
        const chromeOptions: LaunchOptions = {
          ...options,
          executablePath: getChromeCanaryPath(),
        };
        const browser = await chromium.launch(chromeOptions);
        return browser;
      }
    }

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
        `Browser named '${name}' is unknown. It should be one of 'chrome', 'chromium', 'chrome-canary', 'firefox', 'webkit'`,
      );
  }
}
