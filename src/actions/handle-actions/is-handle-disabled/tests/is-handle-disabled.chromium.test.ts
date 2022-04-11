import * as path from 'path';
import { Browser, ElementHandle, chromium } from 'playwright';
import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { sleep } from '../../../../utils';

describe('handle is disabled', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector has no disabled property', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-disabled.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('p');
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is disabled', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-disabled.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#disabledInput');
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector is enabled', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-disabled.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#enabledInput');
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when selector select is enabled', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-disabled.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#enabledSelect');
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector select is disabled', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-disabled.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#disabledSelect');
    const result = await SUT.isHandleDisabled(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });
});
