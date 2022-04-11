import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';

describe('handle has attribue with expected value', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return true when selector has attribute with the expected value', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-attribute.test.html')}`;
    await page.goto(url);

    const selector = '#with-placeholder';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAttribute(handle, 'data-is-valid', 'false');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector has not the attribute', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-attribute.test.html')}`;
    await page.goto(url);

    const selector = '#with-no-placeholder';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAttribute(handle, 'foo', 'bar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when attribute does not match', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-attribute.test.html')}`;
    await page.goto(url);

    const selector = '#with-placeholder';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAttribute(handle, 'data-is-valid', 'yo');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });
});
