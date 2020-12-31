import { TimeZoneId } from './timezone-ids';
import { Viewport } from '../devices';

export interface Geolocation {
  longitude: number;
  latitude: number;
  accuracy?: number;
}

export type Permission =
  | '*'
  | 'geolocation'
  | 'midi'
  | 'midi-sysex'
  | 'notifications'
  | 'push'
  | 'camera'
  | 'microphone'
  | 'background-sync'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'accessibility-events'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'payment-handler';

export interface BrowserContextOptions {
  bypassCSP?: boolean;
  extraHTTPHeaders?: Record<string, string>;
  geolocation?: Geolocation;
  ignoreHTTPSErrors?: boolean;
  javaScriptEnabled?: boolean;
  locale?: string;
  permissions?: Permission[];
  timezoneId?: TimeZoneId;
  userAgent?: string;
  viewport?: Viewport | null;
  proxy?: {
    /**
     * Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example `http://myproxy.com:3128` or `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP proxy.
     */
    server: string;

    /**
     * Optional coma-separated domains to bypass proxy, for example `".com, chromium.org, .domain.com"`.
     */
    bypass?: string;

    /**
     * Optional username to use if HTTP proxy requires authentication.
     */
    username?: string;

    /**
     * Optional password to use if HTTP proxy requires authentication.
     */
    password?: string;
  };

  /**
   * Enables HAR recording for all pages into `recordHar.path` file. If not specified, the HAR is not recorded. Make sure to await `browserContext.close()` for the HAR to be saved.
   */
  recordHar?: {
    /**
     * Optional setting to control whether to omit request content from the HAR. Defaults to `false`.
     */
    omitContent?: boolean;

    /**
     * Path on the filesystem to write the HAR file to.
     */
    path: string;
  };

  /**
   * Enables video recording for all pages into `recordVideo.dir` directory. If not specified videos are not recorded. Make sure to await `browserContext.close()` for videos to be saved.
   */
  recordVideo?: {
    /**
     * Path to the directory to put videos into.
     */
    dir: string;

    /**
     * Optional dimensions of the recorded videos. If not specified the size will be equal to `viewport`. If `viewport` is not configured explicitly the video size defaults to 1280x720. Actual picture of each page will be scaled down if necessary to fit the specified size.
     */
    size?: {
      /**
       * Video frame width.
       */
      width: number;

      /**
       * Video frame height.
       */
      height: number;
    };
  };
  storageState?: StorageState | string;
}

/**
 * Populates context with given storage state. This method can be used to initialize context with logged-in information obtained via `browserContext.storageState([options])`. Either a path to the file with saved storage, or an object with the following fields:
 */
export type StorageState = {
  /**
   * Optional cookies to set for context
   */
  cookies?: Array<{
    /**
     * **required**
     */
    name: string;

    /**
     * **required**
     */
    value: string;

    /**
     * Optional either url or domain / path are required
     */
    url?: string;

    /**
     * Optional either url or domain / path are required
     */
    domain?: string;

    /**
     * Optional either url or domain / path are required
     */
    path?: string;

    /**
     * Optional Unix time in seconds.
     */
    expires?: number;

    /**
     * Optional httpOnly flag
     */
    httpOnly?: boolean;

    /**
     * Optional secure flag
     */
    secure?: boolean;

    /**
     * Optional sameSite flag
     */
    sameSite?: 'Lax' | 'None' | 'Strict';
  }>;

  /**
   * Optional localStorage to set for context
   */
  origins?: Array<{
    origin: string;

    localStorage: Array<{
      name: string;

      value: string;
    }>;
  }>;
};
