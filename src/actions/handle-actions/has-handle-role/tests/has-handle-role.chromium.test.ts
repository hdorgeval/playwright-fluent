import * as path from 'path';
import { chromium } from 'playwright';
import * as SUT from '../index';

describe('handle has role', (): void => {
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {});

  test('should return true when selector has expected role', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-role.test.html')}`;
    await page.goto(url);

    const selector = '#with-role';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleRole(handle, 'role of this input field');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
    await browser.close();
  });

  test('should return false when selector has no role', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-role.test.html')}`;
    await page.goto(url);

    const selector = '#with-no-role';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleRole(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
    await browser.close();
  });

  test('should return false when selector has empty role', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-role.test.html')}`;
    await page.goto(url);

    const selector = '#with-empty-role';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleRole(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
    await browser.close();
  });

  test('should return false when role does not match', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-role.test.html')}`;
    await page.goto(url);

    const selector = '#with-role';
    const handle = await page.$(selector);

    // When
    const result = await SUT.hasHandleRole(handle, 'foobar');

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
    await browser.close();
  });
});
