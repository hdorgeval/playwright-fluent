import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { defaultClickOptions, ClickOptions } from '../click-on-handle';
import { hasHandleFocus } from '../../has-handle-focus';
import { showMousePosition } from '../../../dom-actions';
import { getChromeCanaryPath } from '../../../../utils';

describe.skip('click on handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should throw when selector is undefined - chrome-canary', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true, executablePath: getChromeCanaryPath() });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error(
      "Cannot click on 'foobar' because selector was not found in DOM",
    );

    await SUT.clickOnHandle(undefined, 'foobar', page, defaultClickOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is null - chrome-canary', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true, executablePath: getChromeCanaryPath() });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    // Then
    const expectedError = new Error(
      "Cannot click on 'foobar' because selector was not found in DOM",
    );

    await SUT.clickOnHandle(null, 'foobar', page, defaultClickOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should wait for the selector to be enabled - chrome-canary', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true, executablePath: getChromeCanaryPath() });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-then-enabled';
    const handle = await page.$('#disabled-then-enabled');
    await SUT.clickOnHandle(handle, selector, page, defaultClickOptions);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
  });

  test('should wait for the selector to be enabled (verbose) - chrome-canary', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true, executablePath: getChromeCanaryPath() });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'click-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-then-enabled';
    const handle = await page.$('#disabled-then-enabled');
    const options: ClickOptions = {
      ...defaultClickOptions,
    };
    await SUT.clickOnHandle(handle, selector, page, options);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
  });
});
