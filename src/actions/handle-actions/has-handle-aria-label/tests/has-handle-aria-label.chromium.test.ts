import * as path from 'path';
import { chromium } from 'playwright';
import * as SUT from '../index';

describe('handle has aria-label', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterEach(async (): Promise<void> => {});

  test('should return true when selector has expected aria-label', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-aria-label.test.html')}`;
    await page.goto(url);

    const selector = '#with-aria-label';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAriaLabel(handle, 'label for this input field');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
    await browser.close();
  });

  test('should return false when selector has no aria-label', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-aria-label.test.html')}`;
    await page.goto(url);

    const selector = '#with-no-aria-label';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAriaLabel(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
    await browser.close();
  });

  test('should return false when selector has empty aria-label', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-aria-label.test.html')}`;
    await page.goto(url);

    const selector = '#with-empty-aria-label';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAriaLabel(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
    await browser.close();
  });

  test('should return false when aria-label does not match', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-aria-label.test.html')}`;
    await page.goto(url);

    const selector = '#with-aria-label';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleAriaLabel(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
    await browser.close();
  });
});
