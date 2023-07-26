import * as path from 'path';
import { Browser, firefox } from 'playwright';
import * as SUT from '../index';
import { sleep } from '../../../../utils';
import { defaultVerboseOptions } from '../../is-handle-visible';

describe('handle is visible in viewport', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return false when selector is hidden - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#hidden');

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is visible in viewport', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#visible');

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#transparent');

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#out-of-screen');

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when selector is out of viewport', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-visible-in-viewport.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const handle = await page.$('#out-of-viewport');

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });
});
