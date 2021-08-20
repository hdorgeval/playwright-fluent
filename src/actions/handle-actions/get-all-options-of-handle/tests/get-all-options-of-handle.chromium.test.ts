import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('get all options of handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should throw when selector is not a select - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`;
    await page.goto(url);

    const selector = '#empty-input';
    const handle = await page.$(selector);

    // When
    // Then
    const expectedError = new Error("Cannot find any options in selector '#empty-input'");

    await SUT.getAllOptionsOfHandle(handle, selector).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should get all options of a disabled select - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-select';
    const handle = await page.$(selector);
    const result = await SUT.getAllOptionsOfHandle(handle, selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[1].selected).toBe(true);
    expect(result[1].label).toBe('label 2');
    expect(result[1].value).toBe('2');
  });

  test('should get all options of an enabled select - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#enabled-select';
    const handle = await page.$(selector);
    const result = await SUT.getAllOptionsOfHandle(handle, selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
    expect(result[0].selected).toBe(true);
    expect(result[0].label).toBe('');
    expect(result[0].value).toBe('');
  });

  test('should get empty array when select has no options - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-all-options-of-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#no-options-select';
    const handle = await page.$(selector);
    const result = await SUT.getAllOptionsOfHandle(handle, selector);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
