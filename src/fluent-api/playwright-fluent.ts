import { BrowserContextOptions, Geolocation, Permission } from './playwright-types';
import * as assertion from '../assertions';
import * as action from '../actions';
import {
  BrowserName,
  CheckOptions,
  ClearTextOptions,
  ClickOptions,
  defaultCheckOptions,
  defaultClearTextOptions,
  defaultClickOptions,
  defaultFullPageScreenshotOptions,
  defaultHoverOptions,
  defaultKeyboardPressOptions,
  defaultLaunchOptions,
  defaultNavigationOptions,
  defaultPasteTextOptions,
  defaultSelectOptions,
  defaultTypeTextOptions,
  HoverOptions,
  KeyboardHoldKey,
  KeyboardKey,
  KeyboardPressOptions,
  LaunchOptions,
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
  Device,
  DeviceName,
  getBrowserArgsForDevice,
  getDevice,
} from '../devices';
import {
  defaultWaitUntilOptions,
  sleep,
  waitForStabilityOf,
  waitUntil,
  WaitUntilOptions,
} from '../utils';
import { SelectorFluent } from '../selector-api';
import { Browser, Page, BrowserContext } from 'playwright';

export { WaitUntilOptions, noWaitNoThrowOptions, defaultWaitUntilOptions } from '../utils';
export {
  BrowserName,
  CheckOptions,
  ClearTextOptions,
  ClickOptions,
  Headers,
  HoverOptions,
  KeyboardHoldKey,
  KeyboardKey,
  KeyboardPressOptions,
  LaunchOptions,
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

export { Device, DeviceName, allKnownDevices } from '../devices';
export { Geolocation, Permission } from './playwright-types';

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
  hasClass: (className: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasExactValue: (value: string, options?: Partial<AssertOptions>) => PlaywrightFluent;
  hasFocus: (options?: Partial<AssertOptions>) => PlaywrightFluent;
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

  private actions: (() => Promise<void>)[] = [];

  private launchOptions: LaunchOptions = defaultLaunchOptions;
  private contextOptions: BrowserContextOptions = { viewport: null };
  private emulatedDevice: Device | undefined = undefined;

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

    this.browser = await action.launchBrowser(name, this.launchOptions);
    this.browserContext = await this.browser.newContext(contextOptions);
    this.page = await this.browserContext.newPage();
    if (this.showMousePosition) {
      await action.showMousePosition(this.page);
    }
  }

  public withOptions(options: Partial<LaunchOptions>): PlaywrightFluent {
    const updatedOptions: LaunchOptions = {
      ...this.launchOptions,
      ...options,
    };
    this.launchOptions = updatedOptions;
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

  public withPermissions(...permissions: Permission[]): PlaywrightFluent {
    this.contextOptions.permissions = permissions;
    return this;
  }

  private async closeBrowser(): Promise<void> {
    await action.closeBrowser(this.currentBrowser());
  }

  public close(): PlaywrightFluent {
    const action = (): Promise<void> => this.closeBrowser();
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

  private async onRequestToRespondWith<T>(
    partialUrl: string,
    response: Partial<MockResponse<T>>,
  ): Promise<void> {
    await action.onRequestToRespondWith(partialUrl, response, this.currentPage());
  }
  public onRequestTo(
    partialUrl: string,
  ): {
    respondWith: <T>(response: Partial<MockResponse<T>>) => PlaywrightFluent;
  } {
    return {
      respondWith: <T>(response: Partial<MockResponse<T>>): PlaywrightFluent => {
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

  private async gotoUrl(url: string, options: NavigationOptions): Promise<void> {
    await action.navigateTo(url, options, this.currentPage());
  }
  public navigateTo(
    url: string,
    options: Partial<NavigationOptions> = defaultNavigationOptions,
  ): PlaywrightFluent {
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
    options: Partial<HoverOptions> = defaultHoverOptions,
  ): PlaywrightFluent {
    const hoverOptions: HoverOptions = {
      ...defaultHoverOptions,
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
    options: Partial<ClickOptions> = defaultClickOptions,
  ): PlaywrightFluent {
    const clickOptions: ClickOptions = {
      ...defaultClickOptions,
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
    options: Partial<CheckOptions> = defaultCheckOptions,
  ): PlaywrightFluent {
    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
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
    options: Partial<CheckOptions> = defaultCheckOptions,
  ): PlaywrightFluent {
    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
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
        options: Partial<SelectOptions> = defaultSelectOptions,
      ): PlaywrightFluent => {
        const selectOptions: SelectOptions = {
          ...defaultSelectOptions,
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
      inFocused: (options: Partial<SelectOptions> = defaultSelectOptions): PlaywrightFluent => {
        const selectOptions: SelectOptions = {
          ...defaultSelectOptions,
          ...options,
        };

        const action = (): Promise<void> =>
          this.selectOptionsInFocusedSelector(labels, selectOptions);
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
  public typeText(
    text: string,
    options: Partial<TypeTextOptions> = defaultTypeTextOptions,
  ): PlaywrightFluent {
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
  public clearText(options: Partial<ClearTextOptions> = defaultClearTextOptions): PlaywrightFluent {
    const clearTextOptions: ClearTextOptions = {
      ...defaultClearTextOptions,
      ...options,
    };

    const action = (): Promise<void> => this.clearTextInFocusedElement(clearTextOptions);
    this.actions.push(action);
    return this;
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
  public pasteText(
    text: string,
    options: Partial<PasteTextOptions> = defaultPasteTextOptions,
  ): PlaywrightFluent {
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
  public pressKey(
    key: KeyboardKey,
    options: Partial<KeyboardPressOptions> = defaultKeyboardPressOptions,
  ): PlaywrightFluent {
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
    options: Partial<ScreenshotOptions> = defaultFullPageScreenshotOptions,
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
   * @returns {PlaywrightFluent}
   * @memberof PlaywrightFluent
   */
  public waitUntil(
    predicate: () => Promise<boolean>,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): PlaywrightFluent {
    const waitUntilOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...options,
    };

    this.actions.push(
      async (): Promise<void> => {
        const defaultErrorMessage = `Predicate still resolved to false after ${waitUntilOptions.timeoutInMilliseconds} ms.`;
        await waitUntil(predicate, defaultErrorMessage, waitUntilOptions);
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
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): PlaywrightFluent {
    const waitUntilOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
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
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<string | null | undefined> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...options,
    };
    const result = await action.getInnerTextOfSelector(selector, this.currentPage(), waitOptions);
    return result;
  }

  public async getValueOf(
    selector: string,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<string | undefined | null> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...options,
    };
    const result = await action.getValueOfSelector(selector, this.currentPage(), waitOptions);
    return result;
  }

  public async getAllOptionsOf(
    selector: string,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<SelectOptionInfo[]> {
    const waitOptions: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      ...options,
    };
    const result = await action.getAllOptionsOfSelector(selector, this.currentPage(), waitOptions);
    return result;
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
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.hasFocus(selector, this.currentPage(), options);
  }

  private async expectThatSelectorHasFocus(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorHasFocus(selector, this.currentPage(), options);
  }
  public async hasText(
    selector: string | SelectorFluent,
    text: string,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.hasText(selector, text, this.currentPage(), options);
  }

  public async hasValue(
    selector: string | SelectorFluent,
    value: string,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.hasValue(selector, value, this.currentPage(), options);
  }

  public async hasExactValue(
    selector: string | SelectorFluent,
    value: string,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.hasExactValue(selector, value, this.currentPage(), options);
  }

  private async expectThatSelectorHasText(
    selector: string | SelectorFluent,
    text: string,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorHasText(selector, text, this.currentPage(), options);
  }

  private async expectThatSelectorHasExactValue(
    selector: string | SelectorFluent,
    value: string,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorHasExactValue(selector, value, this.currentPage(), options);
  }

  private async expectThatSelectorHasValue(
    selector: string | SelectorFluent,
    value: string,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorHasValue(selector, value, this.currentPage(), options);
  }

  private async expectThatSelectorHasClass(
    selector: string | SelectorFluent,
    className: string,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorHasClass(selector, className, this.currentPage(), options);
  }

  private async expectThatSelectorIsVisible(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorIsVisible(selector, this.currentPage(), options);
  }

  private async expectThatSelectorIsNotVisible(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorIsNotVisible(selector, this.currentPage(), options);
  }

  public async isNotVisible(
    selector: string | SelectorFluent,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.isNotVisible(selector, this.currentPage(), options);
  }

  public async isVisible(
    selector: string | SelectorFluent,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.isVisible(selector, this.currentPage(), options);
  }

  private async expectThatSelectorIsChecked(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorIsChecked(selector, this.currentPage(), options);
  }
  public async isChecked(
    selector: string | SelectorFluent,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.isChecked(selector, this.currentPage(), options);
  }

  private async expectThatSelectorIsUnchecked(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorIsUnchecked(selector, this.currentPage(), options);
  }
  public async isUnchecked(
    selector: string | SelectorFluent,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.isUnchecked(selector, this.currentPage(), options);
  }

  private async expectThatSelectorIsEnabled(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorIsEnabled(selector, this.currentPage(), options);
  }

  public async isEnabled(
    selector: string | SelectorFluent,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.isEnabled(selector, this.currentPage(), options);
  }

  private async expectThatSelectorIsDisabled(
    selector: string | SelectorFluent,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatSelectorIsDisabled(selector, this.currentPage(), options);
  }

  public async isDisabled(
    selector: string | SelectorFluent,
    options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
  ): Promise<boolean> {
    return await assertion.isDisabled(selector, this.currentPage(), options);
  }

  private async expectThatAsyncFuncHasResult(
    func: AsyncFunc,
    value: string | number | boolean | undefined | null,
    options: Partial<AssertOptions> = defaultAssertOptions,
  ): Promise<void> {
    await assertion.expectThatAsyncFuncHasResult(func, value, options);
  }
  public expectThatAsyncFunc(func: AsyncFunc): AsyncFuncExpectAssertion {
    return {
      resolvesTo: (
        value: string | number | boolean | undefined | null,
        options: Partial<AssertOptions> = defaultAssertOptions,
      ): PlaywrightFluent => {
        this.actions.push(() => this.expectThatAsyncFuncHasResult(func, value, options));
        return this;
      },
    };
  }

  public expectThatSelector(selector: string | SelectorFluent): ExpectAssertion {
    return {
      hasClass: (
        className: string,
        options: Partial<AssertOptions> = defaultAssertOptions,
      ): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasClass(selector, className, options));
        return this;
      },

      hasExactValue: (
        value: string,
        options: Partial<AssertOptions> = defaultAssertOptions,
      ): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasExactValue(selector, value, options));
        return this;
      },

      hasFocus: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasFocus(selector, options));
        return this;
      },
      hasText: (
        text: string,
        options: Partial<AssertOptions> = defaultAssertOptions,
      ): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasText(selector, text, options));
        return this;
      },

      hasValue: (
        value: string,
        options: Partial<AssertOptions> = defaultAssertOptions,
      ): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorHasValue(selector, value, options));
        return this;
      },

      isChecked: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsChecked(selector, options));
        return this;
      },

      isUnchecked: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsUnchecked(selector, options));
        return this;
      },

      isDisabled: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsDisabled(selector, options));
        return this;
      },
      isEnabled: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsEnabled(selector, options));
        return this;
      },
      isVisible: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
        this.actions.push(() => this.expectThatSelectorIsVisible(selector, options));
        return this;
      },
      isNotVisible: (options: Partial<AssertOptions> = defaultAssertOptions): PlaywrightFluent => {
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
