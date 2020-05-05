import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('handle is not visible', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

  test('should return true when selector is hidden - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible.test.html')}`;
    await page.goto(url);
    await page.waitForTimeout(1000);

    const handle = await page.$('#hidden');

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector is visible', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible.test.html')}`;
    await page.goto(url);
    await page.waitForTimeout(1000);

    const handle = await page.$('#visible');

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is transparent', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible.test.html')}`;
    await page.goto(url);
    await page.waitForTimeout(1000);

    const handle = await page.$('#transparent');

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector is out of screen', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible.test.html')}`;
    await page.goto(url);
    await page.waitForTimeout(1000);

    const handle = await page.$('#out-of-screen');

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector is out of viewport', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-not-visible.test.html')}`;
    await page.goto(url);
    await page.waitForTimeout(1000);

    const handle = await page.$('#out-of-viewport');

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });
});
