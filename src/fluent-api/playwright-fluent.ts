import {
  BrowserContextOptions,
  Geolocation,
  HarOptions,
  Permission,
  RecordVideoOptions,
  StorageState,
} from './playwright-types';
import { TimeZoneId } from './timezone-ids';
import * as assertion from '../assertions';
import * as action from '../actions';
import {
  BrowserName,
  CheckOptions,
  ClearTextOptions,
  ClickOptions,
  CloseOptions,
  DateFormat,
  DateTimeFormatOptions,
  defaultCheckOptions,
  defaultClearTextOptions,
  defaultClickOptions,
  defaultCloseOptions,
  defaultDoubleClickOptions,
  defaultFullPageScreenshotOptions,
  defaultHarRequestResponseOptions,
  defaultHoverOptions,
  defaultInvokeOptions,
  defaultKeyboardPressOptions,
  defaultLaunchOptions,
  defaultMocksOptions,
  defaultNavigationOptions,
  defaultPasteTextOptions,
  defaultSelectOptions,
  defaultSwitchToIframeOptions,
  defaultTypeTextOptions,
  DoubleClickOptions,
  FluentMock,
  HarRequestResponseOptions,
  HoverOptions,
  InvokeOptions,
  KeyboardHoldKey,
  KeyboardKey,
  KeyboardPressOptions,
  LaunchOptions,
  MethodName,
  MockedResponse,
  NavigationOptions,
  PasteTextOptions,
  RequestInterceptionFilterOptions,
  ScreenshotOptions,
  SelectOptionInfo,
  SelectOptions,
  SwitchToIframeOptions,
  TypeTextOptions,
  validateMock,
  WindowState,
  WithMocksOptions,
} from '../actions';
import {
  allKnownDevices,
  defaultWindowSizeOptions,
  Device,
  DeviceName,
  getBrowserArgsForDevice,
  getDevice,
  WindowSize,
  WindowSizeOptions,
  getBrowserArgsForWindowSize,
  ViewportSize,
  ViewportOptions,
  defaultViewportOptions,
} from '../devices';
import {
  defaultWaitUntilOptions,
  deleteFile,
  getFilesOlderThanInDirectory,
  HarData,
  getHarDataFrom,
  sleep,
  toFrame,
  toPage,
  waitForStabilityOf,
  WaitOptions,
  waitUntil,
  WaitUntilOptions,
  HttpHeaders,
} from '../utils';
import { SelectorFluent } from '../selector-api';
import { Request, Browser, Page, BrowserContext, Frame, Dialog } from 'playwright';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const isCI = require('is-ci') as boolean;

export {
  defaultWaitUntilOptions,
  getHarDataFrom,
  getHarResponseContentAs,
  getHarResponseFor,
  HarData,
  HarEntryParserOptions,
  harHeadersToHttpHeaders,
  HttpHeaders,
  noWaitNoThrowOptions,
  uniqueFilename,
  userDownloadsDirectory,
  userHomeDirectory,
  WaitOptions,
  WaitUntilOptions,
} from '../utils';

export {
  BrowserName,
  CheckOptions,
  ClearTextOptions,
  ClickOptions,
  CloseOptions,
  DateFormat,
  DateTimeFormatOptions,
  defaultMocksOptions,
  DoubleClickOptions,
  FluentMock,
  generateCodeForMissingMock,
  getMissingMocks,
  getOutdatedMocks,
  HarRequestResponseOptions,
  HoverOptions,
  InvokeOptions,
  KeyboardHoldKey,
  KeyboardKey,
  KeyboardPressOptions,
  LaunchOptions,
  MethodName,
  MissingMock,
  MockedResponse,
  mockGetWithEmptyResponseAndStatus,
  mockGetWithForbiddenResponse,
  mockGetWithJavascriptResponse,
  mockGetWithJsonResponse,
  mockGetWithJsonResponseDependingOnQueryString,
  mockGetWithUnauthorizedResponse,
  mockPostWithEmptyResponseAndStatus,
  NavigationOptions,
  PasteTextOptions,
  Point,
  RequestInfos,
  RequestInterceptionFilterOptions,
  ResponseData,
  ScreenshotOptions,
  SelectOptionInfo,
  SelectOptions,
  SerializableDOMRect,
  SwitchToIframeOptions,
  TypeTextOptions,
  validateMock,
  WindowState,
} from '../actions';

export {
  allKnownDevices,
  Device,
  DeviceName,
  sizeOf,
  Viewport,
  ViewportOptions,
  ViewportSize,
  WindowSize,
  WindowSizeOptions,
} from '../devices';
export {
  BrowserContextOptions,
  Geolocation,
  HarOptions,
  Permission,
  RecordVideoOptions,
  StorageState,
} from './playwright-types';

export { TimeZoneId } from './timezone-ids';

export interface AssertOptions {
  /**
   * Defaults to 30000 milliseconds.
   *
   * @type {number}
   * @memberof AssertOptions
   */
  timeoutInMilliseconds: number;
  /**
   * time during which the Assert must give back the same result.
   * Defaults to 300 milliseconds.
   * You must not setup a duration < 100 milliseconds.
   * @type {number}
   * @memberof AssertOptions
   */
  stabilityInMilliseconds: number;
  /**
   * Will generate 'debug' logs,
   * so that you can understand why the assertion does not give the expected result.
   * Defaults to false
   * @type {boolean}
   * @memberof AssertOptions
   */
  verbose: boolean;
}

export const defaultAssertOptions: AssertOptions = {
  stabilityInMilliseconds: 300,
  timeoutInMilliseconds: 30000,
  verbose: false,
};
export type Story = (p: PlaywrightFluent) => Promise<void>;
export type StoryWithProps<T> = (p: PlaywrightFluent, props: T) => Promise<void>;

export type AsyncFunc = () => Promise<string | number | boolean | undefined | null>;
export interface AsyncFuncExpectAssertion {
  resolvesTo: (
    value: string | number | boolean | undefined | null,
    options?: Partial<AssertOptions>,
  ) => PlaywrightFluent;
}

export interface ExpectAssertion {
  doesNotHaveClass: (className: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  doesNotExist: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  exists: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasAttributeWithValue: (
    attrbuteName: string,
    attributeValue: string,
    options?: Partial<AssertOptions>,
  ) => PlaywrightFluent;

  hasClass: (className: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasExactValue: (value: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasFocus: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasPlaceholder: (text: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasText: (text: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasValue: (value: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  isChecked: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isDisabled: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isEnabled: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isNotVisible: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isReadOnly: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isUnchecked: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isVisible: (options?: Partial<AssertOptions>) => PlaywrightFluent;
}

export type DialogType = 'alert' | 'confirm' | 'prompt' | 'beforeunload';

export interface ExpectDialogAssertion {
  hasMessage: (message: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  isOfType: (dialogType: DialogType, options?: Partial<AssertOptions>) => PlaywrightFluent;
}

export class PlaywrightFluent implements PromiseLike<void> {
  public async then<TResult1 = void, TResult2 = never>(
    onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ): Promise<TResult1 | TResult2> {
    // prettier-ignore
    return await this.executeActions()
      .then(onfulfilled)
      .catch(onrejected);
  }

  private _lastError?: Error;
  public lastError(): Error | undefined {
    return this._lastError;
  }
  private async executeActions(): Promise<void> {
    try {
      this._lastError = undefined;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (this.actions.length === 0) {
          break;
        }
        const action = this.actions.shift();
        action && (await action());
      }
    } catch (error) {
      this._lastError = error as Error;
      this.actions = [];
      throw error;
    } finally {
      this.actions = [];
    }
  }

  constructor(browser?: Browser, pageOrFrame?: Page | Frame | null) {
    if (browser && pageOrFrame) {
      this.browser = browser;
      this.page = toPage(pageOrFrame);
      this.frame = toFrame(pageOrFrame);
    }
  }

  private browser: Browser | undefined;
  private browserContext: BrowserContext | undefined;
  public currentBrowser(): Browser | undefined {
    return this.browser;
  }

  private dialog: Dialog | undefined;
  private _isDialogOpened = false;
  public isDialogOpened(): boolean {
    return this._isDialogOpened;
  }

  private _isDialogClosed = true;
  public isDialogClosed(): boolean {
    return this._isDialogClosed;
  }

  public currentDialog(): Dialog | undefined {
    return this.dialog;
  }

  private page: Page | undefined;
  public currentPage(): Page | undefined {
    return this.page;
  }

  private frame: Frame | undefined;
  public currentFrame(): Frame | undefined {
    return this.frame;
  }

  /**
   * When execution context is a frame it will returns the current playwright Frame object,
   * otherwise it returns the current playwright Page object
   *
   * @returns {(Page | Frame | undefined)}
   * @memberof PlaywrightFluent
   */
  public currentPageOrFrame(): Page | Frame | undefined {
    if (this.frame) {
      return this.frame;
    }

    return this.page;
  }

  private _previousPage: Page | undefined;
  public previousPage(): Page | undefined {
    return this._previousPage;
  }

  private _hasBeenRedirectedToAnotherTab = false;
  public hasBeenRedirectedToAnotherTab(): boolean {
    return this._hasBeenRedirectedToAnotherTab;
  }

  private _context: unknown = {};

  /**
   * Private context object you can use to store data shared between any steps at runtime
   *
   * @readonly
   * @type {unknown}
   * @memberof PlaywrightFluent
   */
  public get context(): unknown {
    return this._context;
  }

  /**
   * Private typed context object you can use to store data shared between any steps at runtime
   *
   * @readonly
   * @type {unknown}
   * @memberof PlaywrightFluent
   */
  public contextAs<T>(): T {
    return this._context as T;
  }

  private actions: (() => Promise<void>)[] = [];

  private launchOptions: LaunchOptions = defaultLaunchOptions;
  private defaultWaitOptions: WaitOptions = {
    ...defaultWaitUntilOptions,
  };
  private defaultAssertOptions: AssertOptions = {
    ...defaultAssertOptions,
  };

  private buildAssertOptionsFrom(options?: Partial<AssertOptions>) {
    const fullOptions: AssertOptions = {
      ...this.defaultAssertOptions,
      ...options,
    };
    return fullOptions;
  }
  private contextOptions: BrowserContextOptions = { viewport: null, acceptDownloads: true };
  private emulatedDevice: Device | undefined = undefined;
  private customWindowSize: WindowSize | undefined = undefined;
  private customWindowSizeOptions: WindowSizeOptions = defaultWindowSizeOptions;
  private showMousePosition = false;
  private handleDialogs = false;

  private async launchBrowser(name: BrowserName): Promise<void> {
    const contextOptions: BrowserContextOptions = { ...this.contextOptions };

    if (this.emulatedDevice) {
      contextOptions.viewport = this.emulatedDevice.viewport;
      contextOptions.userAgent = this.emulatedDevice.userAgent;
      contextOptions.hasTouch = this.emulatedDevice.hasTouch;
      contextOptions.isMobile = name !== 'firefox' && this.emulatedDevice.isMobile;
      contextOptions.screen = this.emulatedDevice.screen;

      this.launchOptions.args = this.launchOptions.args || [];
      this.launchOptions.args.push(
        ...getBrowserArgsForDevice(this.emulatedDevice).andBrowser(name),
      );
    }

    if (this.customWindowSize) {
      this.launchOptions.args = this.launchOptions.args || [];
      this.launchOptions.args.push(
        ...getBrowserArgsForWindowSize(
          this.customWindowSize,
          this.customWindowSizeOptions,
        ).andBrowser(name),
      );
    }

    this.browser = await action.launchBrowser(name, this.launchOptions);
    this.browserContext = await this.browser.newContext(contextOptions);

    this.browserContext.on('page', async (p) => {
      this._previousPage = this.page;
      this.page = p;
      this._hasBeenRedirectedToAnotherTab = true;
      try {
        await p.waitForLoadState();
        // eslint-disable-next-line no-empty
      } catch (error) {}
    });

    this.page = await this.browserContext.newPage();
    if (this.showMousePosition) {
      await action.showMousePosition(this.page);
    }
    if (this.handleDialogs) {
      await action.recordPageDialogs(this.page, (dialog) => {
        this.dialog = dialog;
        this._isDialogOpened = true;
        this._isDialogClosed = false;
      });
    }
  }

  private async gotoPreviousTab(): Promise<void> {
    if (!this._previousPage) {
      return;
    }
    await this._previousPage.bringToFront();
    const from = this._previousPage;
    this._previousPage = this.page;
    this.page = from;
    this._hasBeenRedirectedToAnotherTab = true;
  }

  public withDefaultWaitOptions(options: Partial<WaitOptions>): PlaywrightFluent {
    const updatedOptions: WaitOptions = {
      ...this.defaultWaitOptions,
      ...options,
    };
    this.defaultWaitOptions = updatedOptions;
    return this;
  }

  public withDefaultAssertOptions(options: Partial<AssertOptions>): PlaywrightFluent {
    const updatedOptions: AssertOptions = {
      ...this.defaultAssertOptions,
      ...options,
    };
    this.defaultAssertOptions = updatedOptions;
    return this;
  }

  public withOptions(options: Partial<LaunchOptions>): PlaywrightFluent {
    const updatedOptions: LaunchOptions = {
      ...this.launchOptions,
      ...options,
    };
    this.launchOptions = updatedOptions;
    return this;
  }

  public withWindowSize(size: WindowSize, options?: Partial<WindowSizeOptions>): PlaywrightFluent {
    const windowSizeOptions: WindowSizeOptions = {
      ...defaultWindowSizeOptions,
      ...options,
    };

    this.customWindowSize = size;
    this.customWindowSizeOptions = windowSizeOptions;
    return this;
  }

  public withViewport(
    viewport: ViewportSize,
    options?: Partial<ViewportOptions>,
  ): PlaywrightFluent {
    const viewportOptions: ViewportOptions = {
      ...defaultViewportOptions,
      ...options,
    };

    if (viewportOptions.ciOnly && !isCI) {
      return this;
    }

    this.contextOptions.viewport = viewport;
    return this;
  }

  public withBrowser(name: BrowserName): PlaywrightFluent {
    const action = (): Promise<void> => this.launchBrowser(name);
    this.actions.push(action);
    return this;
  }

  public withGeolocation(location: Geolocation): PlaywrightFluent {
    this.contextOptions.geolocation = location;
    return this;
  }

  public withTimezone(timezoneId: TimeZoneId): PlaywrightFluent {
    this.contextOptions.timezoneId = timezoneId;
    return this;
  }

  public withExtraHttpHeaders(headers: HttpHeaders): PlaywrightFluent {
    this.contextOptions.extraHTTPHeaders = headers;
    return this;
  }

  public withPermissions(...permissions: Permission[]): PlaywrightFluent {
    this.contextOptions.permissions = permissions;
    return this;
  }

  public withStorageState(storageStateFile: string | StorageState): PlaywrightFluent {
    this.contextOptions.storageState = storageStateFile;
    return this;
  }

  /**
   * Show mouse position with a non intrusive cursor
   *
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public withCursor(): PlaywrightFluent {
    this.showMousePosition = true;
    return this;
  }

  /**
   * Subscribe to page Dialogs events, so that you can act and assert on opened dialogs.
   *
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public WithDialogs(): PlaywrightFluent {
    this.handleDialogs = true;
    return this;
  }

  /**
   * Enables HAR recording for all pages.
   * Network activity will be saved into options.path file.
   * If not specified, the HAR is not recorded.
   * Make sure to await browserContext.close() for the HAR to be saved.
   *
   * @param {HarOptions} options
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   * @example
   *  const p = new PlaywrightFluent();
   *  const harFilepath = `${path.join(__dirname, uniqueFilename({ prefix: 'har-', extension: '.json' }))}`;
   *  await p
   *    .withBrowser('chromium')
   *    .withOptions({ headless: true })
   *    .withCursor()
   *    .recordNetworkActivity({ path: harFilepath })
   *    ...
   *    .close();
   *
   *  const harData = p.getRecordedNetworkActivity();
   *
   */
  public recordNetworkActivity(options: HarOptions): PlaywrightFluent {
    this.contextOptions.recordHar = options;
    return this;
  }

  /**
   * Enables video recording into the options.dir directory.
   * If not specified videos are not recorded.
   * Make sure to await browserContext.close() for videos to be saved.
   *
   * @param {RecordVideoOptions} options
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   *
   * @example
   *  const p = new PlaywrightFluent();
   *  await p
   *    .withBrowser('chromium')
   *    .withOptions({ headless: true })
   *    .withWindowSize(sizeOf._1024x768)
   *    .clearVideoFilesOlderThan(__dirname, 60)
   *    .recordVideo({ dir: __dirname, size: sizeOf._1024x768 })
   *    .navigateTo(url)
   *    ...
   *    .close();
   *
   *  const videoPath = await p.getRecordedVideoPath();
   */
  public recordVideo(options: RecordVideoOptions): PlaywrightFluent {
    this.contextOptions.recordVideo = options;
    return this;
  }
  public async getRecordedVideoPath(): Promise<string | undefined> {
    const videoPath = await this.page?.video()?.path();
    return videoPath;
  }

  private async clearVideoFiles(dir: string, durationInSeconds: number): Promise<void> {
    const files = getFilesOlderThanInDirectory(dir, durationInSeconds, (path) => {
      return path.endsWith('.webm');
    });
    files.forEach((file) => {
      // eslint-disable-next-line no-console
      console.warn(`File '${file}' is about to be deleted`);
      deleteFile(file);
    });
  }

  /**
   * Remove video files generated by previous tests run
   *
   * @param {string} dir
   * @param {number} durationInSeconds
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public clearVideoFilesOlderThan(dir: string, durationInSeconds: number): PlaywrightFluent {
    const action = (): Promise<void> => this.clearVideoFiles(dir, durationInSeconds);
    this.actions.push(action);
    return this;
  }

  /**
   * Get HAR data as json data.
   * Call this method only after the browser is closed.
   * @param {string} [filepath] optional
   * @returns {HarData}
   * @memberof PlaywrightFluent
   */
  public getRecordedNetworkActivity(filepath?: string): HarData {
    const harFilePath = filepath || this.contextOptions.recordHar?.path;
    return getHarDataFrom(harFilePath);
  }

  private async closeBrowser(options: CloseOptions): Promise<void> {
    await action.closeBrowser(this.currentBrowser(), options);
  }

  public close(options?: Partial<CloseOptions>): PlaywrightFluent {
    const closeOptions: CloseOptions = {
      ...defaultCloseOptions,
      ...options,
    };
    const action = (): Promise<void> => this.closeBrowser(closeOptions);
    this.actions.push(action);
    return this;
  }

  public switchToPreviousTab(): PlaywrightFluent {
    const action = (): Promise<void> => this.gotoPreviousTab();
    this.actions.push(action);
    return this;
  }

  private sentRequests: Request[] = [];
  public getRecordedRequestsTo(url: string): Request[] {
    return [...this.sentRequests.filter((req) => req.url().includes(url))];
  }
  public getLastRecordedRequestTo(url: string): Request | undefined {
    return this.sentRequests.filter((req) => req.url().includes(url)).pop();
  }

  public clearRecordedRequestsTo(url: string): void {
    this.sentRequests = [...this.sentRequests.filter((req) => !req.url().includes(url))];
  }
  private async recordRequestsToUrl(
    partialUrl: string,
    ignorePredicate: (request: Request) => boolean,
  ): Promise<void> {
    await action.recordRequestsTo(partialUrl, ignorePredicate, this.currentPage(), (request) =>
      this.sentRequests.push(request),
    );
  }

  /**
   * Will track and record requests whose url contains the input url.
   * Usefull when you need to check what the front sends to the back and/or what the back sends to the front.
   * Each recorded request is a standard `playwright` request object that contains both the request and the response.
   *
   * @param {string} partialUrl This parameter should be seen as a partial url (it is not a regex and not a glob pattern).
   * @param {(request: Request) => boolean} [ignorePredicate=() => false] optional predicate to provide if you want to ignore specific requests
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   * @example
   *  const p = new PlaywrightFluent();
   *  await p
   *    .withBrowser('chromium')
   *    .withOptions({ headless: true })
   *    .withCursor()
   *    .recordRequestsTo('/api/v1/user', (request) => request.method() === 'OPTIONS')
   *    .recordRequestsTo('/api/v1/books')
   *    .navigateTo(url);
   */
  public recordRequestsTo(
    partialUrl: string,
    ignorePredicate: (request: Request) => boolean = () => false,
  ): PlaywrightFluent {
    const action = (): Promise<void> => this.recordRequestsToUrl(partialUrl, ignorePredicate);
    this.actions.push(action);
    return this;
  }

  private async recordDownloadsToDirectory(directory: string): Promise<void> {
    await action.recordDownloadsTo(directory, this.currentPage());
  }
  /**
   * Save all downloads in directory.
   *
   * @param {string} directory
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   *
   * @example
   *  const p = new PlaywrightFluent();
   *  const expectedDownloadedFilepath = path.join(userDownloadsDirectory, 'download.zip');
   *  await p
   *    .withBrowser('chromium')
   *    .withOptions({ headless: true })
   *    .withCursor()
   *    .recordDownloadsTo(userDownloadsDirectory)
   *    .navigateTo(url)
   *    .click('a#download-package')
   *    .waitUntil(async () => fileExists(expectedDownloadedFilepath));
   */
  public recordDownloadsTo(directory: string): PlaywrightFluent {
    const action = (): Promise<void> => this.recordDownloadsToDirectory(directory);
    this.actions.push(action);
    return this;
  }

  private async delayRequestsToUrl(partialUrl: string, delayInSeconds: number): Promise<void> {
    await action.delayRequestsTo(partialUrl, delayInSeconds, this.currentPage());
  }
  public delayRequestsTo(partialUrl: string, delayInSeconds: number): PlaywrightFluent {
    const action = (): Promise<void> => this.delayRequestsToUrl(partialUrl, delayInSeconds);
    this.actions.push(action);
    return this;
  }

  private async onRequestToRespondWith<T>(
    partialUrl: string,
    options: Partial<RequestInterceptionFilterOptions>,
    response: Partial<MockedResponse<T>> | ((request: Request) => Partial<MockedResponse<T>>),
  ): Promise<void> {
    await action.onRequestToRespondWith(partialUrl, options, response, this.currentPage());
  }

  private async onRequestToRespondFromHar(
    partialUrl: string,
    harFiles: string[],
    options: HarRequestResponseOptions,
  ): Promise<void> {
    await action.onRequestToRespondFromHar(partialUrl, harFiles, this.currentPage(), options);
  }
  public onRequestTo(
    partialUrl: string,
    options: Partial<RequestInterceptionFilterOptions> = {},
  ): {
    respondWith: <T>(
      response: Partial<MockedResponse<T>> | ((request: Request) => Partial<MockedResponse<T>>),
    ) => PlaywrightFluent;
    respondFromHar: (
      harFiles: string[],
      options?: Partial<HarRequestResponseOptions>,
    ) => PlaywrightFluent;
  } {
    return {
      respondWith: <T>(
        response: Partial<MockedResponse<T>> | ((request: Request) => Partial<MockedResponse<T>>),
      ): PlaywrightFluent => {
        const action = (): Promise<void> =>
          this.onRequestToRespondWith(partialUrl, options, response);
        this.actions.push(action);
        return this;
      },
      respondFromHar: (
        harFiles: string[],
        options?: Partial<HarRequestResponseOptions>,
      ): PlaywrightFluent => {
        const harOptions: HarRequestResponseOptions = {
          ...defaultHarRequestResponseOptions,
          ...options,
        };
        const action = (): Promise<void> =>
          this.onRequestToRespondFromHar(partialUrl, harFiles, harOptions);
        this.actions.push(action);
        return this;
      },
    };
  }

  private failedRequests: Request[] = [];
  public getFailedRequests(): Request[] {
    return [...this.failedRequests];
  }
  public clearFailedRequests(): void {
    this.failedRequests = [];
  }
  private async recordAllFailedRequests(): Promise<void> {
    await action.recordFailedRequests(this.currentPage(), (request) =>
      this.failedRequests.push(request),
    );
  }
  public recordFailedRequests(): PlaywrightFluent {
    const action = (): Promise<void> => this.recordAllFailedRequests();
    this.actions.push(action);
    return this;
  }

  private pageErrors: Error[] = [];
  public getPageErrors(): Error[] {
    return [...this.pageErrors];
  }
  public clearPageErrors(): void {
    this.pageErrors = [];
  }
  private async recordUncaughtExceptions(): Promise<void> {
    await action.recordPageErrors(this.currentPage(), (err) => this.pageErrors.push(err));
  }

  public recordPageErrors(): PlaywrightFluent {
    const action = (): Promise<void> => this.recordUncaughtExceptions();
    this.actions.push(action);
    return this;
  }
  private async saveStorageStateToFile(targetFile: string): Promise<void> {
    await this.browserContext?.storageState({ path: targetFile });
  }

  /**
   * Will save the storage state in a local file
   *
   * @param {string} targetFile : The file path to save the storage state to. If path is a relative path, then it is resolved relative to current working directory
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public saveStorageStateTo(targetFile: string): PlaywrightFluent {
    const action = (): Promise<void> => this.saveStorageStateToFile(targetFile);
    this.actions.push(action);
    return this;
  }

  /**
   * Get current Playwright Storage State
   *
   * @returns {(Promise<StorageState | undefined>)}
   * @memberof PlaywrightFluent
   */
  public async currentStorageState(): Promise<StorageState | undefined> {
    return await this.browserContext?.storageState();
  }

  private async pauseExecution(): Promise<void> {
    await action.pause(this.currentPage());
  }
  public pause(): PlaywrightFluent {
    const action = (): Promise<void> => this.pauseExecution();
    this.actions.push(action);
    return this;
  }

  private async waitForDialogToOpen(options: WaitUntilOptions): Promise<void> {
    await action.waitForDialog(() => this.dialog, this.currentPage(), options);
  }
  /**
   * Wait for a dialog to open.
   *
   * @param {Partial<WaitUntilOptions>} [options={}]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public waitForDialog(options: Partial<WaitUntilOptions> = {}): PlaywrightFluent {
    const waitUntilOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const action = (): Promise<void> => this.waitForDialogToOpen(waitUntilOptions);
    this.actions.push(action);
    return this;
  }

  private async cancelCurrentDialog(): Promise<void> {
    await action.cancelDialog(this.dialog, this.currentPage(), () => {
      this.dialog = undefined;
      this._isDialogClosed = true;
      this._isDialogOpened = false;
    });
  }
  public cancelDialog(): PlaywrightFluent {
    const action = (): Promise<void> => this.cancelCurrentDialog();
    this.actions.push(action);
    return this;
  }

  private async acceptCurrentDialog(): Promise<void> {
    await action.acceptDialog(this.dialog, undefined, this.currentPage(), () => {
      this.dialog = undefined;
      this._isDialogClosed = true;
      this._isDialogOpened = false;
    });
  }
  public acceptDialog(): PlaywrightFluent {
    const action = (): Promise<void> => this.acceptCurrentDialog();
    this.actions.push(action);
    return this;
  }

  private _mocksContext: unknown = {};
  /**
   * context shared between all mocks.
   *
   * @readonly
   * @type {unknown}
   * @memberof PlaywrightFluent
   */
  public get mocksContext(): unknown {
    return this._mocksContext;
  }

  /**
   * typed context shared between all mocks.
   *
   * @template T
   * @returns {T}
   * @memberof PlaywrightFluent
   */
  public mocksContextAs<T>(): T {
    return this._mocksContext as T;
  }

  private _allMocks: Partial<FluentMock>[] = [];
  private async registerMocks(options: Partial<WithMocksOptions>): Promise<void> {
    await action.withMocks(
      () => this._allMocks,
      () => this._mocksContext,
      options,
      this.currentPage(),
    );
  }

  /**
   * Provide a set of mocks in order to automatically handle request interceptions
   * This method can be called multiple times with different set of mocks:
   * in this case all mocks are concatenated in a single internal array.
   *
   * @param {() => Partial<FluentMock>[]} mocks
   * @param {Partial<WithMocksOptions>} [options=defaultMocksOptions]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public withMocks(
    mocks: Partial<FluentMock>[],
    options: Partial<WithMocksOptions> = defaultMocksOptions,
  ): PlaywrightFluent {
    mocks.forEach(validateMock);

    if (this._allMocks.length === 0) {
      const action = (): Promise<void> => this.registerMocks(options);
      this.actions.push(action);
    }
    this._allMocks = this._allMocks.concat(mocks);
    return this;
  }

  private async gotoUrl(url: string, options: NavigationOptions): Promise<void> {
    await action.navigateTo(url, options, this.currentPageOrFrame());
  }
  public navigateTo(url: string, options?: Partial<NavigationOptions>): PlaywrightFluent {
    const navigationOptions: NavigationOptions = {
      ...defaultNavigationOptions,
      ...options,
    };
    const action = (): Promise<void> => this.gotoUrl(url, navigationOptions);
    this.actions.push(action);
    return this;
  }

  private async hoverOnSelector(selector: string, options: HoverOptions): Promise<void> {
    await action.hoverOnSelector(selector, this.currentPageOrFrame(), options);
  }
  private async hoverOnSelectorObject(
    selector: SelectorFluent,
    options: HoverOptions,
  ): Promise<void> {
    await action.hoverOnSelectorObject(selector, this.currentPageOrFrame(), options);
  }
  public hover(
    selector: string | SelectorFluent,
    options?: Partial<HoverOptions>,
  ): PlaywrightFluent {
    const hoverOptions: HoverOptions = {
      ...defaultHoverOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> => this.hoverOnSelector(selector, hoverOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> => this.hoverOnSelectorObject(selector, hoverOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async switchFromSelectorToIframe(
    selector: string,
    options: SwitchToIframeOptions,
  ): Promise<void> {
    this.frame = await action.switchFromSelectorToIframe(selector, this.currentPageOrFrame(), {
      ...options,
      injectCursor: this.showMousePosition,
    });
  }
  private async switchFromSelectorObjectToIframe(
    selector: SelectorFluent,
    options: SwitchToIframeOptions,
  ): Promise<void> {
    this.frame = await action.switchFromSelectorObjectToIframe(
      selector,
      this.currentPageOrFrame(),
      {
        ...options,
        injectCursor: this.showMousePosition,
      },
    );
  }
  /**
   * Will switch inside the iframe targeted by the specified selector
   *
   * @param {(string | SelectorFluent)} selector
   * @param {Partial<SwitchToIframeOptions>} [options]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   *
   * @example
   *  const p = new PlaywrightFluent();
   *  const selector = 'iframe';
   *  const inputInIframe = '#input-inside-iframe';
   *  const inputInMainPage = '#input-in-main-page';
   *  await p
   *    .withBrowser('chromium')
   *    .withOptions({ headless: false })
   *    .withCursor()
   *    .navigateTo(url)
   *    .hover(selector)
   *    .switchToIframe(selector)
   *    .click(inputInIframe)
   *    .typeText('hey I am in the iframe')
   *    .switchBackToPage()
   *    .click(inputInMainPage)
   *    .typeText('hey I am back in the page!');
   */
  public switchToIframe(
    selector: string | SelectorFluent,
    options?: Partial<SwitchToIframeOptions>,
  ): PlaywrightFluent {
    const switchToIframeOptions: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> =>
        this.switchFromSelectorToIframe(selector, switchToIframeOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> =>
        this.switchFromSelectorObjectToIframe(selector, switchToIframeOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async switchBackFromIframeToCurrentPage(): Promise<void> {
    this.frame = undefined;
  }

  /**
   * Will switch from the current Iframe back to the current page.
   *
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public switchBackToPage(): PlaywrightFluent {
    const action = (): Promise<void> => this.switchBackFromIframeToCurrentPage();
    this.actions.push(action);
    return this;
  }

  private async clickOnSelector(selector: string, options: ClickOptions): Promise<void> {
    await action.clickOnSelector(selector, this.currentPageOrFrame(), options);
  }
  private async clickOnSelectorObject(
    selector: SelectorFluent,
    options: ClickOptions,
  ): Promise<void> {
    await action.clickOnSelectorObject(selector, this.currentPageOrFrame(), options);
  }
  public click(
    selector: string | SelectorFluent,
    options?: Partial<ClickOptions>,
  ): PlaywrightFluent {
    const clickOptions: ClickOptions = {
      ...defaultClickOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> => this.clickOnSelector(selector, clickOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> => this.clickOnSelectorObject(selector, clickOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async doubleClickOnSelector(
    selector: string,
    options: DoubleClickOptions,
  ): Promise<void> {
    await action.doubleClickOnSelector(selector, this.currentPageOrFrame(), options);
  }
  private async doubleClickOnSelectorObject(
    selector: SelectorFluent,
    options: DoubleClickOptions,
  ): Promise<void> {
    await action.doubleClickOnSelectorObject(selector, this.currentPageOrFrame(), options);
  }
  public doubleClick(
    selector: string | SelectorFluent,
    options?: Partial<DoubleClickOptions>,
  ): PlaywrightFluent {
    const doubleClickOptions: DoubleClickOptions = {
      ...defaultDoubleClickOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> => this.doubleClickOnSelector(selector, doubleClickOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> =>
        this.doubleClickOnSelectorObject(selector, doubleClickOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async checkSelector(selector: string, options: CheckOptions): Promise<void> {
    await action.checkSelector(selector, this.currentPageOrFrame(), options);
  }
  private async checkSelectorObject(
    selector: SelectorFluent,
    options: CheckOptions,
  ): Promise<void> {
    await action.checkSelectorObject(selector, this.currentPageOrFrame(), options);
  }
  public check(
    selector: string | SelectorFluent,
    options?: Partial<CheckOptions>,
  ): PlaywrightFluent {
    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> => this.checkSelector(selector, checkOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> => this.checkSelectorObject(selector, checkOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async uncheckSelector(selector: string, options: CheckOptions): Promise<void> {
    await action.uncheckSelector(selector, this.currentPageOrFrame(), options);
  }
  private async uncheckSelectorObject(
    selector: SelectorFluent,
    options: CheckOptions,
  ): Promise<void> {
    await action.uncheckSelectorObject(selector, this.currentPageOrFrame(), options);
  }
  public uncheck(
    selector: string | SelectorFluent,
    options?: Partial<CheckOptions>,
  ): PlaywrightFluent {
    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> => this.uncheckSelector(selector, checkOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> => this.uncheckSelectorObject(selector, checkOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async selectOptionsInSelector(
    selector: string,
    labels: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsInSelector(selector, labels, this.currentPageOrFrame(), options);
  }

  private async selectOptionsInFocusedSelector(
    labels: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsInFocused(labels, this.currentPageOrFrame(), options);
  }
  private async selectOptionsInSelectorObject(
    selector: SelectorFluent,
    labels: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsInSelectorObject(
      selector,
      labels,
      this.currentPageOrFrame(),
      options,
    );
  }
  public select(...labels: string[]): {
    in: (selector: string | SelectorFluent, options?: Partial<SelectOptions>) => PlaywrightFluent;
    inFocused: (options?: Partial<SelectOptions>) => PlaywrightFluent;
  } {
    return {
      in: (
        selector: string | SelectorFluent,
        options?: Partial<SelectOptions>,
      ): PlaywrightFluent => {
        const selectOptions: SelectOptions = {
          ...defaultSelectOptions,
          ...this.defaultWaitOptions,
          ...options,
        };

        if (typeof selector === 'string') {
          const action = (): Promise<void> =>
            this.selectOptionsInSelector(selector, labels, selectOptions);
          this.actions.push(action);
          return this;
        }

        {
          const action = (): Promise<void> =>
            this.selectOptionsInSelectorObject(selector, labels, selectOptions);
          this.actions.push(action);
          return this;
        }
      },
      inFocused: (options?: Partial<SelectOptions>): PlaywrightFluent => {
        const selectOptions: SelectOptions = {
          ...defaultSelectOptions,
          ...this.defaultWaitOptions,
          ...options,
        };

        const action = (): Promise<void> =>
          this.selectOptionsInFocusedSelector(labels, selectOptions);
        this.actions.push(action);

        return this;
      },
    };
  }

  private async selectOptionsByValueInFocusedSelector(
    values: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsByValueInFocused(values, this.currentPageOrFrame(), options);
  }

  private async selectOptionsByValueInSelector(
    selector: string,
    values: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsByValueInSelector(
      selector,
      values,
      this.currentPageOrFrame(),
      options,
    );
  }

  private async selectOptionsByValueInSelectorObject(
    selector: SelectorFluent,
    values: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsByValueInSelectorObject(
      selector,
      values,
      this.currentPageOrFrame(),
      options,
    );
  }

  public selectByValue(...values: string[]): {
    in: (selector: string | SelectorFluent, options?: Partial<SelectOptions>) => PlaywrightFluent;
    inFocused: (options?: Partial<SelectOptions>) => PlaywrightFluent;
  } {
    return {
      in: (
        selector: string | SelectorFluent,
        options?: Partial<SelectOptions>,
      ): PlaywrightFluent => {
        const selectOptions: SelectOptions = {
          ...defaultSelectOptions,
          ...this.defaultWaitOptions,
          ...options,
        };

        if (typeof selector === 'string') {
          const action = (): Promise<void> =>
            this.selectOptionsByValueInSelector(selector, values, selectOptions);
          this.actions.push(action);
          return this;
        }

        {
          const action = (): Promise<void> =>
            this.selectOptionsByValueInSelectorObject(selector, values, selectOptions);
          this.actions.push(action);
          return this;
        }
      },
      inFocused: (options?: Partial<SelectOptions>): PlaywrightFluent => {
        const selectOptions: SelectOptions = {
          ...defaultSelectOptions,
          ...this.defaultWaitOptions,
          ...options,
        };

        const action = (): Promise<void> =>
          this.selectOptionsByValueInFocusedSelector(values, selectOptions);
        this.actions.push(action);

        return this;
      },
    };
  }

  /**
   * Emulate device
   *
   * @param {DeviceName} deviceName
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public emulateDevice(deviceName: DeviceName): PlaywrightFluent {
    const device = getDevice(deviceName);
    if (!device) {
      throw new Error(
        `device '${deviceName}' is unknown. It must be one of : [${allKnownDevices
          .map((d) => d.name)
          .join(';')}] `,
      );
    }
    this.emulatedDevice = device;
    return this;
  }

  private async typeTextInFocusedElement(text: string, options: TypeTextOptions): Promise<void> {
    await action.typeText(text, this.currentPageOrFrame(), options);
  }

  /**
   * Type text in the element that has current focus.
   *
   * @param {string} text
   * @param {Partial<TypeTextOptions>} [options=defaultTypeTextOptions]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public typeText(text: string, options?: Partial<TypeTextOptions>): PlaywrightFluent {
    const typeTextOptions: TypeTextOptions = {
      ...defaultTypeTextOptions,
      ...options,
    };

    const action = (): Promise<void> => this.typeTextInFocusedElement(text, typeTextOptions);
    this.actions.push(action);
    return this;
  }

  private async clearTextInFocusedElement(options: ClearTextOptions): Promise<void> {
    await action.clearText(this.currentPageOrFrame(), options);
  }
  /**
   * Clear text in the element that has current focus.
   *
   * @param {Partial<ClearTextOptions>} [options=defaultClearTextOptions]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public clearText(options?: Partial<ClearTextOptions>): PlaywrightFluent {
    const clearTextOptions: ClearTextOptions = {
      ...defaultClearTextOptions,
      ...options,
    };

    const action = (): Promise<void> => this.clearTextInFocusedElement(clearTextOptions);
    this.actions.push(action);
    return this;
  }

  /**
   * Alias for clearText.
   *
   * @param {Partial<ClearTextOptions>} [options=defaultClearTextOptions]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public clear(options?: Partial<ClearTextOptions>): PlaywrightFluent {
    return this.clearText(options);
  }

  private async invokeMethodOnSelector(
    methodName: MethodName,
    selector: string,
    options: InvokeOptions,
  ): Promise<void> {
    await action.invokeMethodOnSelector(methodName, selector, this.currentPageOrFrame(), options);
  }
  private async invokeMethodOnSelectorObject(
    methodName: MethodName,
    selector: SelectorFluent,
    options: InvokeOptions,
  ): Promise<void> {
    await action.invokeMethodOnSelectorObject(methodName, selector, options);
  }
  /**
   * Be able to invoke a native method on a selector.
   * Use this action only in edge cases
   * where the selector itself is hidden because of its transprency,
   * or because it has null dimension,
   * and the normal click does not work neither on this selector nor on it's parent.
   *
   * @param {MethodName} methodName
   * @param {(string | SelectorFluent)} selector
   * @param {Partial<InvokeOptions>} [options]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public invokeMethod(
    methodName: MethodName,
    selector: string | SelectorFluent,
    options?: Partial<InvokeOptions>,
  ): PlaywrightFluent {
    const invokeOptions: InvokeOptions = {
      ...defaultInvokeOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    if (typeof selector === 'string') {
      const action = (): Promise<void> =>
        this.invokeMethodOnSelector(methodName, selector, invokeOptions);
      this.actions.push(action);
      return this;
    }

    {
      const action = (): Promise<void> =>
        this.invokeMethodOnSelectorObject(methodName, selector, invokeOptions);
      this.actions.push(action);
      return this;
    }
  }

  private async pasteTextInFocusedElement(text: string, options: PasteTextOptions): Promise<void> {
    await action.pasteText(text, this.currentPageOrFrame(), options);
  }

  /**
   * Paste text in the element that has current focus.
   *
   * @param {string} text
   * @param {Partial<PasteTextOptions>} [options=defaultPasteTextOptions]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public pasteText(text: string, options?: Partial<PasteTextOptions>): PlaywrightFluent {
    const pasteTextOptions: PasteTextOptions = {
      ...defaultPasteTextOptions,
      ...options,
    };

    const action = (): Promise<void> => this.pasteTextInFocusedElement(text, pasteTextOptions);
    this.actions.push(action);
    return this;
  }

  private async pressOnKey(key: KeyboardKey, options: KeyboardPressOptions): Promise<void> {
    await action.pressKey(key, this.currentPageOrFrame(), options);
  }
  public pressKey(key: KeyboardKey, options?: Partial<KeyboardPressOptions>): PlaywrightFluent {
    const pressKeyOptions: KeyboardPressOptions = {
      ...defaultKeyboardPressOptions,
      ...options,
    };
    const action = (): Promise<void> => this.pressOnKey(key, pressKeyOptions);
    this.actions.push(action);
    return this;
  }
  private async holdKey(key: KeyboardHoldKey): Promise<void> {
    await action.holdDownKey(key, this.currentPageOrFrame());
  }
  public holdDownKey(key: KeyboardHoldKey): PlaywrightFluent {
    const action = (): Promise<void> => this.holdKey(key);
    this.actions.push(action);
    return this;
  }
  private async releaseHoldKey(key: KeyboardHoldKey): Promise<void> {
    await action.releaseKey(key, this.currentPageOrFrame());
  }

  public releaseKey(key: KeyboardHoldKey): PlaywrightFluent {
    const action = (): Promise<void> => this.releaseHoldKey(key);
    this.actions.push(action);
    return this;
  }

  public wait(durationInMilliseconds: number): PlaywrightFluent {
    this.actions.push(async (): Promise<void> => await sleep(durationInMilliseconds));
    return this;
  }
  public async takeFullPageScreenshotAsBase64(
    options?: Partial<ScreenshotOptions>,
  ): Promise<string> {
    const screenshotOptions: ScreenshotOptions = {
      ...defaultFullPageScreenshotOptions,
      ...options,
    };
    const result = await action.takeFullPageScreenshotAsBase64(
      this.currentPage(),
      screenshotOptions,
    );
    return result;
  }

  public runStory<T>(story: Story | StoryWithProps<T>, param?: T): PlaywrightFluent {
    if (typeof story !== 'function') {
      throw new Error('Story should be a function');
    }

    if (param === undefined) {
      this.actions.push(async (): Promise<void> => await (story as Story)(this));
      return this;
    }

    this.actions.push(async (): Promise<void> => await story(this, param));
    return this;
  }

  /**
   * Wait until predicate becomes true,
   * and always return true during 300 ms.
   * The waiting mechanism can be modified by setting options
   *
   * @param {() => Promise<boolean>} predicate
   * @param {Partial<WaitUntilOptions>} [options=defaultWaitUntilOptions]
   * @param {(string | (() => Promise<string>))} errorMessage
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public waitUntil(
    predicate: () => Promise<boolean>,
    options: Partial<WaitUntilOptions> = {},
    errorMessage?: string | (() => Promise<string>),
  ): PlaywrightFluent {
    const waitUntilOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const defaultErrorMessage = `Predicate still resolved to false after ${waitUntilOptions.timeoutInMilliseconds} ms.`;
    const errorMessageOrDefault = errorMessage || defaultErrorMessage;
    this.actions.push(async (): Promise<void> => {
      await waitUntil(predicate, errorMessageOrDefault, waitUntilOptions);
    });
    return this;
  }

  /**
   * Waits until the function getValue() returns the same result during 300 ms.
   * The waiting mechanism can be modified by setting options
   *
   * @param {(() => Promise<string | boolean | number | null | undefined>)} getValue
   * @param {Partial<WaitUntilOptions>} [options=defaultWaitUntilOptions]
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public waitForStabilityOf(
    getValue: () => Promise<string | boolean | number | null | undefined>,
    options?: Partial<WaitUntilOptions>,
  ): PlaywrightFluent {
    const waitUntilOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };

    this.actions.push(async (): Promise<void> => {
      const defaultErrorMessage = `Value function could not have a stable result after ${waitUntilOptions.timeoutInMilliseconds} ms. Use verbose option to get more details.`;
      await waitForStabilityOf(getValue, defaultErrorMessage, waitUntilOptions);
    });
    return this;
  }

  public async getCurrentUrl(): Promise<string> {
    return await action.getCurrentUrl(this.currentPageOrFrame());
  }

  public async getCurrentWindowState(): Promise<WindowState> {
    return await action.getWindowState(this.currentPageOrFrame());
  }
  public async getInnerTextOf(
    selector: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<string | null | undefined> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const result = await action.getInnerTextOfSelector(
      selector,
      this.currentPageOrFrame(),
      waitOptions,
    );
    return result;
  }

  public async getSelectedText(): Promise<string> {
    const page = this.currentPageOrFrame();
    if (!page) {
      return '';
    }
    /* istanbul ignore next */
    const selectedText = await page.evaluate(() => (document.getSelection() || '').toString());
    return selectedText;
  }

  /**
   * Get the today date inside the browser
   *
   * @param {(DateFormat | DateTimeFormatOptions)} [format] see more details for DateTimeFormatOptions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#examples
   * @returns {Promise<string>}
   * @memberof PlaywrightFluent
   *
   * @example
   * const p = new PlaywrightFluent();
   *  await p
   *    .withBrowser('chromium')
   *    .withOptions({ headless: true })
   *    .withCursor()
   *    .withTimezone('Asia/Tokyo')
   *    .navigateTo(url);
   *
   *  const today = await p.getToday('yyyy-mm-dd');
   *  const todayInCustomFormat = await p.getToday({
   *    locale: 'en',
   *    intlOptions: { year: 'numeric', month: 'short', day: 'numeric' },
   * })
   */
  public async getToday(format?: DateFormat | DateTimeFormatOptions): Promise<string> {
    const page = this.currentPageOrFrame();
    return await action.getToday(page, format);
  }

  public async getValueOf(
    selector: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<string | undefined | null> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const result = await action.getValueOfSelector(
      selector,
      this.currentPageOrFrame(),
      waitOptions,
    );
    return result;
  }

  public async getAllOptionsOf(
    selector: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<SelectOptionInfo[]> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const result = await action.getAllOptionsOfSelector(
      selector,
      this.currentPageOrFrame(),
      waitOptions,
    );
    return result;
  }

  public async getSelectedOptionOf(
    selector: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<SelectOptionInfo | undefined> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const selectOptions = await action.getAllOptionsOfSelector(
      selector,
      this.currentPageOrFrame(),
      waitOptions,
    );
    const selectedOption = selectOptions.find((option) => option.selected);
    return selectedOption;
  }

  public async getAllSelectedOptionsOf(
    selector: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<SelectOptionInfo[]> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultWaitOptions,
      ...options,
    };
    const selectOptions = await action.getAllOptionsOfSelector(
      selector,
      this.currentPageOrFrame(),
      waitOptions,
    );
    const selectedOptions = selectOptions.filter((option) => option.selected);
    return selectedOptions;
  }

  /**
   * Create a Selector object to be able to target a DOM element
   * that is embedded in a complex dom hierarchy or dom array
   *
   * @param {string} selector
   * @returns {SelectorFluent}
   * @memberof PlaywrightFluent
   */
  public selector(selector: string): SelectorFluent {
    return new SelectorFluent(selector, this);
  }
  public async hasFocus(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.hasFocus(selector, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorHasFocus(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasFocus(selector, this.currentPageOrFrame(), fullOptions);
  }
  public async hasText(
    selector: string | SelectorFluent,
    text: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.hasText(selector, text, this.currentPageOrFrame(), waitOptions);
  }

  public async hasValue(
    selector: string | SelectorFluent,
    value: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.hasValue(selector, value, this.currentPageOrFrame(), waitOptions);
  }

  public async hasExactValue(
    selector: string | SelectorFluent,
    value: string,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.hasExactValue(selector, value, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorHasText(
    selector: string | SelectorFluent,
    text: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasText(
      selector,
      text,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  private async expectThatSelectorHasExactValue(
    selector: string | SelectorFluent,
    value: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasExactValue(
      selector,
      value,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  private async expectThatSelectorHasValue(
    selector: string | SelectorFluent,
    value: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasValue(
      selector,
      value,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  private async expectThatSelectorHasClass(
    selector: string | SelectorFluent,
    className: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasClass(
      selector,
      className,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  private async expectThatSelectorDoesNotHaveClass(
    selector: string | SelectorFluent,
    className: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorDoesNotHaveClass(
      selector,
      className,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  private async expectThatSelectorHasPlaceholder(
    selector: string | SelectorFluent,
    text: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasPlaceholder(
      selector,
      text,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  private async expectThatSelectorHasAttributeWithValue(
    selector: string | SelectorFluent,
    attributeName: string,
    attributeValue: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasAttributeWithValue(
      selector,
      attributeName,
      attributeValue,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }
  private async expectThatSelectorExists(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorDoesExist(selector, this.currentPageOrFrame(), fullOptions);
  }

  private async expectThatSelectorDoesNotExist(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorDoesNotExist(
      selector,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  public async exists(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.doesExist(selector, this.currentPageOrFrame(), waitOptions);
  }

  public async doesNotExist(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.doesNotExist(selector, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorIsVisible(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsVisible(selector, this.currentPageOrFrame(), fullOptions);
  }

  private async expectThatSelectorIsNotVisible(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsNotVisible(
      selector,
      this.currentPageOrFrame(),
      fullOptions,
    );
  }

  public async isNotVisible(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isNotVisible(selector, this.currentPageOrFrame(), waitOptions);
  }

  public async isVisible(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isVisible(selector, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorIsChecked(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsChecked(selector, this.currentPageOrFrame(), fullOptions);
  }
  public async isChecked(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isChecked(selector, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorIsUnchecked(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsUnchecked(selector, this.currentPageOrFrame(), fullOptions);
  }
  public async isUnchecked(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isUnchecked(selector, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorIsEnabled(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsEnabled(selector, this.currentPageOrFrame(), fullOptions);
  }

  public async isEnabled(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isEnabled(selector, this.currentPageOrFrame(), waitOptions);
  }

  private async expectThatSelectorIsDisabled(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsDisabled(selector, this.currentPageOrFrame(), fullOptions);
  }

  public async isDisabled(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const assertOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isDisabled(selector, this.currentPageOrFrame(), assertOptions);
  }
  private async expectThatSelectorIsReadOnly(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsReadOnly(selector, this.currentPageOrFrame(), fullOptions);
  }
  public async isReadOnly(
    selector: string | SelectorFluent,
    options?: Partial<WaitUntilOptions>,
  ): Promise<boolean> {
    const assertOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...this.defaultAssertOptions,
      ...options,
    };
    return await assertion.isReadOnly(selector, this.currentPageOrFrame(), assertOptions);
  }

  private async expectThatAsyncFuncHasResult(
    func: AsyncFunc,
    value: string | number | boolean | undefined | null,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const assertOptions: AssertOptions = {
      ...this.defaultAssertOptions,
      ...options,
    };
    await assertion.expectThatAsyncFuncHasResult(func, value, assertOptions);
  }
  public expectThatAsyncFunc(func: AsyncFunc): AsyncFuncExpectAssertion {
    return {
      resolvesTo: (
        value: string | number | boolean | undefined | null,
        options?: Partial<AssertOptions>,
      ): PlaywrightFluent => {
        this.actions.push(() => this.expectThatAsyncFuncHasResult(func, value, options));
        return this;
      },
    };
  }

  public expectThatSelector(selector: string | SelectorFluent): ExpectAssertion {
    return {
      doesNotHaveClass: (className: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() =>
          this.expectThatSelectorDoesNotHaveClass(selector, className, options),
        );
        return this;
      },
      doesNotExist: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorDoesNotExist(selector, options));
        return this;
      },

      exists: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorExists(selector, options));
        return this;
      },
      hasAttributeWithValue: (
        attributeName: string,
        attributeValue: string,
        options?: Partial<AssertOptions>,
      ): PlaywrightFluent => {
        this.actions.push(() =>
          this.expectThatSelectorHasAttributeWithValue(
            selector,
            attributeName,
            attributeValue,
            options,
          ),
        );
        return this;
      },

      hasClass: (className: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasClass(selector, className, options));
        return this;
      },

      hasExactValue: (value: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasExactValue(selector, value, options));
        return this;
      },

      hasFocus: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasFocus(selector, options));
        return this;
      },

      hasPlaceholder: (text: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasPlaceholder(selector, text, options));
        return this;
      },

      hasText: (text: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasText(selector, text, options));
        return this;
      },

      hasValue: (value: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasValue(selector, value, options));
        return this;
      },

      isChecked: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsChecked(selector, options));
        return this;
      },

      isUnchecked: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsUnchecked(selector, options));
        return this;
      },

      isDisabled: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsDisabled(selector, options));
        return this;
      },
      isEnabled: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsEnabled(selector, options));
        return this;
      },

      isReadOnly: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsReadOnly(selector, options));
        return this;
      },
      isVisible: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsVisible(selector, options));
        return this;
      },
      isNotVisible: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsNotVisible(selector, options));
        return this;
      },
    };
  }

  /**
   * Alias for expectThatSelector()
   *
   * @param {(string | SelectorFluent)} selector
   * @returns {ExpectAssertion}
   * @memberof PlaywrightFluent
   */
  public expectThat(selector: string | SelectorFluent): ExpectAssertion {
    return {
      doesNotHaveClass: (className: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() =>
          this.expectThatSelectorDoesNotHaveClass(selector, className, options),
        );
        return this;
      },
      doesNotExist: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorDoesNotExist(selector, options));
        return this;
      },
      exists: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorExists(selector, options));
        return this;
      },
      hasAttributeWithValue: (
        attributeName: string,
        attributeValue: string,
        options?: Partial<AssertOptions>,
      ): PlaywrightFluent => {
        this.actions.push(() =>
          this.expectThatSelectorHasAttributeWithValue(
            selector,
            attributeName,
            attributeValue,
            options,
          ),
        );
        return this;
      },

      hasClass: (className: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasClass(selector, className, options));
        return this;
      },

      hasExactValue: (value: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasExactValue(selector, value, options));
        return this;
      },

      hasFocus: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasFocus(selector, options));
        return this;
      },

      hasPlaceholder: (text: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasPlaceholder(selector, text, options));
        return this;
      },

      hasText: (text: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasText(selector, text, options));
        return this;
      },

      hasValue: (value: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasValue(selector, value, options));
        return this;
      },

      isChecked: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsChecked(selector, options));
        return this;
      },

      isUnchecked: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsUnchecked(selector, options));
        return this;
      },

      isDisabled: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsDisabled(selector, options));
        return this;
      },
      isEnabled: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsEnabled(selector, options));
        return this;
      },
      isReadOnly: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsReadOnly(selector, options));
        return this;
      },
      isVisible: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsVisible(selector, options));
        return this;
      },
      isNotVisible: (options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsNotVisible(selector, options));
        return this;
      },
    };
  }

  private async expectThatDialogIsOfType(
    dialogType: DialogType,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatDialogIsOfType(() => this.dialog, dialogType, fullOptions);
  }
  private async expectThatDialogHasMessage(
    message: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatDialogHasMessage(() => this.dialog, message, fullOptions);
  }
  public expectThatDialog(): ExpectDialogAssertion {
    return {
      hasMessage: (message: string, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatDialogHasMessage(message, options));
        return this;
      },
      isOfType: (dialogType: DialogType, options?: Partial<AssertOptions>): PlaywrightFluent => {
        this.actions.push(() => this.expectThatDialogIsOfType(dialogType, options));
        return this;
      },
    };
  }
}

/**
 * cast input object as a PlaywrightFluent instance
 * usefull when such instance is store in an untyped context
 * @param p : an untyped PlaywrightFluent instance
 */
export const cast = (p: unknown): PlaywrightFluent => {
  return p as PlaywrightFluent;
};
