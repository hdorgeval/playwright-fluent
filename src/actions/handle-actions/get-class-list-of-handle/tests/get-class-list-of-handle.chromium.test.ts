import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';

describe('get class list of handle', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return empty array when class attribute is empty - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-empty-class-2';
    const handle = await page.$(selector);
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return empty array when class attribute does not exist - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-no-class';
    const handle = await page.$(selector);
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return class list with one item - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-one-class';
    const handle = await page.$(selector);
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('foo');
  });

  test('should return class list with two items - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-class-list-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#with-two-classes';
    const handle = await page.$(selector);
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toBe('foo');
    expect(result[1]).toBe('bar');
  });
});
