import * as SUT from '../index';
import { hasHandleFocus } from '../../has-handle-focus';
import { showMousePosition } from '../../../dom-actions';
import { isHandleChecked } from '../../is-handle-checked';
import { defaultCheckOptions, CheckOptions } from '../../check-handle';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('uncheck handle', (): void => {
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
    const url = `file:${path.join(__dirname, 'uncheck-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error(
      "Cannot uncheck 'foobar' because selector was not found in DOM",
    );

    await SUT.uncheckHandle(undefined, 'foobar', page, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is null - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'uncheck-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error(
      "Cannot uncheck 'foobar' because selector was not found in DOM",
    );

    await SUT.uncheckHandle(null, 'foobar', page, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
  test('should throw when selector is disabled and checked - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'uncheck-handle.test.html')}`;
    await page.goto(url);

    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      timeoutInMilliseconds: 1000,
      verbose: false,
    };

    // When
    const selector = '#checked-and-disabled';
    const handle = await page.$(selector);
    let result: Error | undefined = undefined;

    try {
      await SUT.uncheckHandle(handle, selector, page, checkOptions);
    } catch (error) {
      result = error;
    }

    // Then
    expect(handle).toBeDefined();
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(true);
    expect(result && result.message).toContain(
      "Cannot uncheck '#checked-and-disabled' because this selector is disabled",
    );
  });

  test('should do nothing when selector is already unchecked - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'uncheck-handle.test.html')}`;
    await page.goto(url);

    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      verbose: false,
    };

    // When
    const selector = '#already-unchecked';
    const handle = await page.$(selector);
    await SUT.uncheckHandle(handle, selector, page, checkOptions);

    // Then
    expect(handle).toBeDefined();
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(false);
  });

  test('should wait for the selector to be enabled - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'uncheck-handle.test.html')}`;
    await page.goto(url);

    const checkOptions: CheckOptions = {
      ...defaultCheckOptions,
      verbose: false,
    };

    // When
    const selector = '#disabled-then-enabled';
    const handle = await page.$('#disabled-then-enabled');
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(true);
    await SUT.uncheckHandle(handle, selector, page, checkOptions);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
    expect(await isHandleChecked(handle, { verbose: checkOptions.verbose })).toBe(false);
  });
});
