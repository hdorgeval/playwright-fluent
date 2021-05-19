import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('handle has text', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return true when selector has text', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-text.test.html')}`;
    await page.goto(url);

    const selector = '#p1';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleText(handle, 'foo');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return true when selector has uppercased text', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-text.test.html')}`;
    await page.goto(url);

    const selector = '#upper-case';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleText(handle, 'FOO');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector has not the text', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-text.test.html')}`;
    await page.goto(url);

    const selector = '#p1';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleText(handle, 'yo');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when selector is empty and expected is empty', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-text.test.html')}`;
    await page.goto(url);
    const handle = await page.$('#empty');

    // When
    const result = await SUT.hasHandleText(handle, '');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });
});
