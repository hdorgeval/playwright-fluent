import {
  BrowserContextOptions,
  Geolocation,
  HarOptions,
  Permission,
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
  defaultCheckOptions,
  defaultClearTextOptions,
  defaultClickOptions,
  defaultCloseOptions,
  defaultDoubleClickOptions,
  defaultFullPageScreenshotOptions,
  defaultHoverOptions,
  defaultInvokeOptions,
  defaultKeyboardPressOptions,
  defaultLaunchOptions,
  defaultNavigationOptions,
  defaultPasteTextOptions,
  defaultSelectOptions,
  defaultTypeTextOptions,
  DoubleClickOptions,
  Headers,
  HoverOptions,
  InvokeOptions,
  KeyboardHoldKey,
  KeyboardKey,
  KeyboardPressOptions,
  LaunchOptions,
  MethodName,
  MockResponse,
  NavigationOptions,
  PasteTextOptions,
  ScreenshotOptions,
  SelectOptionInfo,
  SelectOptions,
  TypeTextOptions,
  WindowState,
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
  Viewport,
  ViewportOptions,
  defaultViewportOptions,
} from '../devices';
import {
  defaultWaitUntilOptions,
  HarContent,
  readHarFileAsJson,
  sleep,
  waitForStabilityOf,
  WaitOptions,
  waitUntil,
  WaitUntilOptions,
} from '../utils';
import { SelectorFluent } from '../selector-api';
import { Browser, Page, BrowserContext, Request as PlaywrightRequest } from 'playwright';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isCI = require('is-ci') as boolean;

export {
  defaultWaitUntilOptions,
  HarContent,
  noWaitNoThrowOptions,
  uniqueFilename,
  WaitOptions,
  WaitUntilOptions,
} from '../utils';

export {
  BrowserName,
  CheckOptions,
  ClearTextOptions,
  ClickOptions,
  CloseOptions,
  DoubleClickOptions,
  Headers,
  HoverOptions,
  InvokeOptions,
  KeyboardHoldKey,
  KeyboardKey,
  KeyboardPressOptions,
  LaunchOptions,
  MethodName,
  MockResponse,
  NavigationOptions,
  PasteTextOptions,
  Request,
  Response,
  ScreenshotOptions,
  SelectOptionInfo,
  SelectOptions,
  TypeTextOptions,
  WindowState,
} from '../actions';

export {
  allKnownDevices,
  Device,
  DeviceName,
  sizeOf,
  Viewport,
  ViewportOptions,
  WindowSize,
  WindowSizeOptions,
} from '../devices';
export {
  BrowserContextOptions,
  Geolocation,
  HarOptions,
  Permission,
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
  isUnchecked: (options?: Partial<AssertOptions>) => PlaywrightFluent;
  isVisible: (options?: Partial<AssertOptions>) => PlaywrightFluent;
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
      this._lastError = error;
      this.actions = [];
      throw error;
    } finally {
      this.actions = [];
    }
  }

  constructor(browser?: Browser, page?: Page) {
    if (browser && page) {
      this.browser = browser;
      this.page = page;
    }
  }

  private browser: Browser | undefined;
  private browserContext: BrowserContext | undefined;
  public currentBrowser(): Browser | undefined {
    return this.browser;
  }
  private page: Page | undefined;
  public currentPage(): Page | undefined {
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
  private contextOptions: BrowserContextOptions = { viewport: null };
  private emulatedDevice: Device | undefined = undefined;
  private customWindowSize: WindowSize | undefined = undefined;
  private customWindowSizeOptions: WindowSizeOptions = defaultWindowSizeOptions;
  private showMousePosition = false;
  private async launchBrowser(name: BrowserName): Promise<void> {
    const contextOptions: BrowserContextOptions = { ...this.contextOptions };

    if (this.emulatedDevice) {
      contextOptions.viewport = this.emulatedDevice.viewport;
      contextOptions.userAgent = this.emulatedDevice.userAgent;
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

  public withViewport(viewport: Viewport, options?: Partial<ViewportOptions>): PlaywrightFluent {
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

  public withExtraHttpHeaders(headers: Headers): PlaywrightFluent {
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
   * Get HAR data as json data.
   * Call this method only after the browser is closed.
   * @param {string} [filepath] optional
   * @returns {HarContent}
   * @memberof PlaywrightFluent
   */
  public getRecordedNetworkActivity(filepath?: string): HarContent {
    const harFilePath = filepath || this.contextOptions.recordHar?.path;
    return readHarFileAsJson(harFilePath);
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

  private sentRequests: action.Request[] = [];
  public getRecordedRequestsTo(url: string): action.Request[] {
    return [...this.sentRequests.filter((req) => req.url().includes(url))];
  }
  public getLastRecordedRequestTo(url: string): action.Request | undefined {
    return this.sentRequests.filter((req) => req.url().includes(url)).pop();
  }

  public clearRecordedRequestsTo(url: string): void {
    this.sentRequests = [...this.sentRequests.filter((req) => !req.url().includes(url))];
  }
  private async recordRequestsToUrl(partialUrl: string): Promise<void> {
    await action.recordRequestsTo(partialUrl, this.currentPage(), (request) =>
      this.sentRequests.push(request),
    );
  }
  public recordRequestsTo(partialUrl: string): PlaywrightFluent {
    const action = (): Promise<void> => this.recordRequestsToUrl(partialUrl);
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
    response: Partial<MockResponse<T>> | ((request: PlaywrightRequest) => Partial<MockResponse<T>>),
  ): Promise<void> {
    await action.onRequestToRespondWith(partialUrl, response, this.currentPage());
  }
  public onRequestTo(
    partialUrl: string,
  ): {
    respondWith: <T>(
      response:
        | Partial<MockResponse<T>>
        | ((request: PlaywrightRequest) => Partial<MockResponse<T>>),
    ) => PlaywrightFluent;
  } {
    return {
      respondWith: <T>(
        response:
          | Partial<MockResponse<T>>
          | ((request: PlaywrightRequest) => Partial<MockResponse<T>>),
      ): PlaywrightFluent => {
        const action = (): Promise<void> => this.onRequestToRespondWith(partialUrl, response);
        this.actions.push(action);
        return this;
      },
    };
  }

  private failedRequests: action.Request[] = [];
  public getFailedRequests(): action.Request[] {
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

  private async gotoUrl(url: string, options: NavigationOptions): Promise<void> {
    await action.navigateTo(url, options, this.currentPage());
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
    await action.hoverOnSelector(selector, this.currentPage(), options);
  }
  private async hoverOnSelectorObject(
    selector: SelectorFluent,
    options: HoverOptions,
  ): Promise<void> {
    await action.hoverOnSelectorObject(selector, this.currentPage(), options);
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
  private async clickOnSelector(selector: string, options: ClickOptions): Promise<void> {
    await action.clickOnSelector(selector, this.currentPage(), options);
  }
  private async clickOnSelectorObject(
    selector: SelectorFluent,
    options: ClickOptions,
  ): Promise<void> {
    await action.clickOnSelectorObject(selector, this.currentPage(), options);
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
    await action.doubleClickOnSelector(selector, this.currentPage(), options);
  }
  private async doubleClickOnSelectorObject(
    selector: SelectorFluent,
    options: DoubleClickOptions,
  ): Promise<void> {
    await action.doubleClickOnSelectorObject(selector, this.currentPage(), options);
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
    await action.checkSelector(selector, this.currentPage(), options);
  }
  private async checkSelectorObject(
    selector: SelectorFluent,
    options: CheckOptions,
  ): Promise<void> {
    await action.checkSelectorObject(selector, this.currentPage(), options);
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
    await action.uncheckSelector(selector, this.currentPage(), options);
  }
  private async uncheckSelectorObject(
    selector: SelectorFluent,
    options: CheckOptions,
  ): Promise<void> {
    await action.uncheckSelectorObject(selector, this.currentPage(), options);
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
    await action.selectOptionsInSelector(selector, labels, this.currentPage(), options);
  }

  private async selectOptionsInFocusedSelector(
    labels: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsInFocused(labels, this.currentPage(), options);
  }
  private async selectOptionsInSelectorObject(
    selector: SelectorFluent,
    labels: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsInSelectorObject(selector, labels, this.currentPage(), options);
  }
  public select(
    ...labels: string[]
  ): {
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
    await action.selectOptionsByValueInFocused(values, this.currentPage(), options);
  }

  private async selectOptionsByValueInSelector(
    selector: string,
    values: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsByValueInSelector(selector, values, this.currentPage(), options);
  }

  private async selectOptionsByValueInSelectorObject(
    selector: SelectorFluent,
    values: string[],
    options: SelectOptions,
  ): Promise<void> {
    await action.selectOptionsByValueInSelectorObject(
      selector,
      values,
      this.currentPage(),
      options,
    );
  }

  public selectByValue(
    ...values: string[]
  ): {
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

  private async typeTextInFocusedElement(text: string, options: TypeTextOptions): Promise<void> {
    await action.typeText(text, this.currentPage(), options);
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
    await action.clearText(this.currentPage(), options);
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
    await action.invokeMethodOnSelector(methodName, selector, this.currentPage(), options);
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
    await action.pasteText(text, this.currentPage(), options);
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
    await action.pressKey(key, this.currentPage(), options);
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
    await action.holdDownKey(key, this.currentPage());
  }
  public holdDownKey(key: KeyboardHoldKey): PlaywrightFluent {
    const action = (): Promise<void> => this.holdKey(key);
    this.actions.push(action);
    return this;
  }
  private async releaseHoldKey(key: KeyboardHoldKey): Promise<void> {
    await action.releaseKey(key, this.currentPage());
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
    this.actions.push(
      async (): Promise<void> => {
        await waitUntil(predicate, errorMessageOrDefault, waitUntilOptions);
      },
    );
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

    this.actions.push(
      async (): Promise<void> => {
        const defaultErrorMessage = `Value function could not have a stable result after ${waitUntilOptions.timeoutInMilliseconds} ms. Use verbose option to get more details.`;
        await waitForStabilityOf(getValue, defaultErrorMessage, waitUntilOptions);
      },
    );
    return this;
  }

  public async getCurrentUrl(): Promise<string> {
    return await action.getCurrentUrl(this.currentPage());
  }

  public async getCurrentWindowState(): Promise<WindowState> {
    return await action.getWindowState(this.currentPage());
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
    const result = await action.getInnerTextOfSelector(selector, this.currentPage(), waitOptions);
    return result;
  }

  public async getSelectedText(): Promise<string> {
    const page = this.currentPage();
    if (!page) {
      return '';
    }
    /* istanbul ignore next */
    const selectedText = await page.evaluate(() => (document.getSelection() || '').toString());
    return selectedText;
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
    const result = await action.getValueOfSelector(selector, this.currentPage(), waitOptions);
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
    const result = await action.getAllOptionsOfSelector(selector, this.currentPage(), waitOptions);
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
      this.currentPage(),
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
      this.currentPage(),
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
    return await assertion.hasFocus(selector, this.currentPage(), waitOptions);
  }

  private async expectThatSelectorHasFocus(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasFocus(selector, this.currentPage(), fullOptions);
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
    return await assertion.hasText(selector, text, this.currentPage(), waitOptions);
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
    return await assertion.hasValue(selector, value, this.currentPage(), waitOptions);
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
    return await assertion.hasExactValue(selector, value, this.currentPage(), waitOptions);
  }

  private async expectThatSelectorHasText(
    selector: string | SelectorFluent,
    text: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasText(selector, text, this.currentPage(), fullOptions);
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
      this.currentPage(),
      fullOptions,
    );
  }

  private async expectThatSelectorHasValue(
    selector: string | SelectorFluent,
    value: string,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorHasValue(selector, value, this.currentPage(), fullOptions);
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
      this.currentPage(),
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
      this.currentPage(),
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
      this.currentPage(),
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
      this.currentPage(),
      fullOptions,
    );
  }

  private async expectThatSelectorIsVisible(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsVisible(selector, this.currentPage(), fullOptions);
  }

  private async expectThatSelectorIsNotVisible(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsNotVisible(selector, this.currentPage(), fullOptions);
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
    return await assertion.isNotVisible(selector, this.currentPage(), waitOptions);
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
    return await assertion.isVisible(selector, this.currentPage(), waitOptions);
  }

  private async expectThatSelectorIsChecked(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsChecked(selector, this.currentPage(), fullOptions);
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
    return await assertion.isChecked(selector, this.currentPage(), waitOptions);
  }

  private async expectThatSelectorIsUnchecked(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsUnchecked(selector, this.currentPage(), fullOptions);
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
    return await assertion.isUnchecked(selector, this.currentPage(), waitOptions);
  }

  private async expectThatSelectorIsEnabled(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsEnabled(selector, this.currentPage(), fullOptions);
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
    return await assertion.isEnabled(selector, this.currentPage(), waitOptions);
  }

  private async expectThatSelectorIsDisabled(
    selector: string | SelectorFluent,
    options?: Partial<AssertOptions>,
  ): Promise<void> {
    const fullOptions = this.buildAssertOptionsFrom(options);
    await assertion.expectThatSelectorIsDisabled(selector, this.currentPage(), fullOptions);
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
    return await assertion.isDisabled(selector, this.currentPage(), assertOptions);
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
}

/**
 * cast input object as a PlaywrightFluent instance
 * usefull when such instance is store in an untyped context
 * @param p : an untyped PlaywrightFluent instance
 */
export const cast = (p: unknown): PlaywrightFluent => {
  return p as PlaywrightFluent;
};
