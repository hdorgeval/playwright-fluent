import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('get class list of handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return empty string when attribute is empty - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-attribute-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-empty-attribute';
    const handle = await page.$(selector);
    const result = await SUT.getAttributeOfHandle('foobar', handle);

    // Then
    expect(result).toBe('');
  });

  test('should return null when attribute does not exist - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-attribute-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-no-attribute';
    const handle = await page.$(selector);
    const result = await SUT.getAttributeOfHandle('foobar', handle);

    // Then
    expect(result).toBeNull();
  });

  test('should return attribute value - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-attribute-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-attribute';
    const handle = await page.$(selector);
    const result = await SUT.getAttributeOfHandle('foo', handle);

    // Then
    expect(result).toBe('bar');
  });

  test('should return placeholder value - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-attribute-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-placeholder';
    const handle = await page.$(selector);
    const result = await SUT.getAttributeOfHandle('placeholder', handle);

    // Then
    expect(result).toBe('type text here');
  });
});
