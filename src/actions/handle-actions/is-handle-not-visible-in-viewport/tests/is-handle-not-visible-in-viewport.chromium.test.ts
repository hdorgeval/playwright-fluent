import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { sleep } from '../../../../utils';

describe('handle is not visible in viewport', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return true when selector is hidden - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#hidden');

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector is visible in the viewport', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#visible');

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is transparent', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#transparent');

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector is out of screen', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#out-of-screen');

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector is out of viewport', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#out-of-viewport');

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });
});
