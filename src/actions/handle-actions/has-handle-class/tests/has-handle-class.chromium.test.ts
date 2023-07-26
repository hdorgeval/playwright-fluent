import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';

describe('handle has class', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return true when selector has class', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-class.test.html')}`;
    await page.goto(url);

    const selector = '#with-two-classes';
    const handle = await page.$(selector);

    // When
    const result1 = await SUT.hasHandleClass(handle, 'foo');
    const result2 = await SUT.hasHandleClass(handle, 'bar');

    // Then
    expect(handle).toBeDefined();
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test('should return false when selector has not the class', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-class.test.html')}`;
    await page.goto(url);

    const selector = '#with-two-classes';
    const handle = await page.$(selector);

    // When
    const result1 = await SUT.hasHandleClass(handle, 'foobar');
    const result2 = await SUT.hasHandleClass(handle, 'foo bar');

    // Then
    expect(handle).toBeDefined();
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});
