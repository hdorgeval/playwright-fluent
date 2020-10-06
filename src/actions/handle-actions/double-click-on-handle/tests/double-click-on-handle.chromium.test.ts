import * as SUT from '../index';
import { defaultDoubleClickOptions, DoubleClickOptions } from '../double-click-on-handle';
import { hasHandleFocus } from '../../has-handle-focus';
import { showMousePosition } from '../../../dom-actions';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('double-click on handle', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {
    jest.setTimeout(70000);
  });

  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

  test('should throw when selector is undefined - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'double-click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error(
      "Cannot double-click on 'foobar' because selector was not found in DOM",
    );

    await SUT.doubleClickOnHandle(
      undefined,
      'foobar',
      page,
      defaultDoubleClickOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should throw when selector is null - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'double-click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error(
      "Cannot double-click on 'foobar' because selector was not found in DOM",
    );

    await SUT.doubleClickOnHandle(
      null,
      'foobar',
      page,
      defaultDoubleClickOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should wait for the selector to be enabled - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'double-click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-then-enabled';
    const handle = await page.$('#disabled-then-enabled');
    await SUT.doubleClickOnHandle(handle, selector, page, defaultDoubleClickOptions);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
    const selectedText = await page.evaluate(() => (document.getSelection() || '').toString());
    expect(selectedText).toBe('disabled');
  });

  test.skip('should wait for the selector to be enabled (verbose) - chromium', async (): Promise<
    void
  > => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'double-click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-then-enabled';
    const handle = await page.$('#disabled-then-enabled');
    const options: DoubleClickOptions = {
      ...defaultDoubleClickOptions,
      verbose: true,
    };
    await SUT.doubleClickOnHandle(handle, selector, page, options);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
    const selectedText = await page.evaluate(() => (document.getSelection() || '').toString());
    expect(selectedText).toBe('disabled');
  });
});
