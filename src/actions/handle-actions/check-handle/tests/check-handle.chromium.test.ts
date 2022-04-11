import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { hasHandleFocus } from '../../has-handle-focus';
import { showMousePosition } from '../../../dom-actions';
import { defaultCheckOptions, CheckOptions } from '../check-handle';
import { isHandleChecked } from '../../is-handle-checked';

describe('check handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should throw when selector is undefined - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'check-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error("Cannot check 'foobar' because selector was not found in DOM");

    await SUT.checkHandle(undefined, 'foobar', page, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is null - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'check-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error("Cannot check 'foobar' because selector was not found in DOM");

    await SUT.checkHandle(null, 'foobar', page, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
  test('should throw when selector is disabled and unchecked - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'check-handle.test.html')}`;
    await page.goto(url);

    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      timeoutInMilliseconds: 1000,
      verbose: false,
    };

    // When
    const selector = '#unchecked-and-disabled';
    const handle = await page.$(selector);
    let result: Error | undefined = undefined;

    try {
      await SUT.checkHandle(handle, selector, page, checkOptions);
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(handle).toBeDefined();
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(false);
    expect(result && result.message).toContain(
      "Cannot check '#unchecked-and-disabled' because this selector is disabled",
    );
  });

  test('should do nothing when selector is already checked - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'check-handle.test.html')}`;
    await page.goto(url);

    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      verbose: false,
    };

    // When
    const selector = '#already-checked';
    const handle = await page.$(selector);
    await SUT.checkHandle(handle, selector, page, checkOptions);

    // Then
    expect(handle).toBeDefined();
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(true);
  });

  test('should wait for the selector to be enabled - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'check-handle.test.html')}`;
    await page.goto(url);

    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      verbose: false,
    };

    // When
    const selector = '#disabled-then-enabled';
    const handle = await page.$('#disabled-then-enabled');
    await SUT.checkHandle(handle, selector, page, checkOptions);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(true);
  });
});
