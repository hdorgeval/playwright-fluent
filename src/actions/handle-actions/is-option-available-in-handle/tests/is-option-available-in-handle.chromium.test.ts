import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('is option available in handle', (): void => {
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
    const url = `file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`;
    await page.goto(url);

    const selector = '#empty-input';
    const handle = await page.$(selector);

    // When
    // Then
    const expectedError = new Error("Cannot find any options in selector '#empty-input'");

    await SUT.isOptionAvailableInHandle(handle, selector, 'foo').catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should detect option is available - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-select';
    const handle = await page.$(selector);
    const result = await SUT.isOptionAvailableInHandle(handle, selector, 'label 1');

    // Then
    expect(result).toBe(true);
  });

  test('should detect option is not available - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-select';
    const handle = await page.$(selector);
    const result = await SUT.isOptionAvailableInHandle(handle, selector, 'foobar');

    // Then
    expect(result).toBe(false);
  });

  test('should be case sensitive - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#disabled-select';
    const handle = await page.$(selector);
    const result = await SUT.isOptionAvailableInHandle(handle, selector, 'Label 1');

    // Then
    expect(result).toBe(false);
  });

  test('should detect empty option - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#enabled-select';
    const handle = await page.$(selector);
    const result = await SUT.isOptionAvailableInHandle(handle, selector, '');

    // Then
    expect(result).toBe(true);
  });

  test('should not detect empty option in an empty select - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-option-available-in-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#no-options-select';
    const handle = await page.$(selector);
    const result = await SUT.isOptionAvailableInHandle(handle, selector, '');

    // Then
    expect(result).toBe(false);
  });
});
