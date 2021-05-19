import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('handle does not have class', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return true when selector does not have class', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-not-handle-class.test.html')}`;
    await page.goto(url);

    const selector = '#with-two-classes';
    const handle = await page.$(selector);

    // When
    const result1 = await SUT.hasNotHandleClass(handle, 'foobar');
    const result2 = await SUT.hasNotHandleClass(handle, 'barfoo');

    // Then
    expect(handle).toBeDefined();
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test('should return false when selector has the class', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-not-handle-class.test.html')}`;
    await page.goto(url);

    const selector = '#with-two-classes';
    const handle = await page.$(selector);

    // When
    const result1 = await SUT.hasNotHandleClass(handle, 'foo');
    const result2 = await SUT.hasNotHandleClass(handle, 'bar');

    // Then
    expect(handle).toBeDefined();
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});
