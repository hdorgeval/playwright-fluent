import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';

describe('handle has placeholder', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return true when selector has placeholder', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-placeholder.test.html')}`;
    await page.goto(url);

    const selector = '#with-placeholder';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandlePlaceholder(handle, 'type text here');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when selector has no placeholder', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-placeholder.test.html')}`;
    await page.goto(url);

    const selector = '#with-no-placeholder';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandlePlaceholder(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return false when placeholder does not match', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-placeholder.test.html')}`;
    await page.goto(url);

    const selector = '#with-placeholder';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandlePlaceholder(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });
});
