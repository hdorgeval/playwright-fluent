import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';

describe('get elements with exact text', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given

    // When
    const result = await SUT.getHandlesWithExactText('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return only one element', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-exact-text.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('table thead th', page);
    const result = await SUT.getHandlesWithExactText('header', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'header',
    );
  });

  test('should return only two elements', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-exact-text.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] td', page);
    const result = await SUT.getHandlesWithExactText('cell', rootElements);

    // Then
    expect(rootElements.length).toBe(6);
    expect(result.length).toBe(2);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toBe('cell');
    expect(await result[1].evaluate((node) => (node as HTMLSelectElement).innerText)).toBe('cell');
  });

  test('should return no elements when text is not found', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-exact-text.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] td', page);
    const result = await SUT.getHandlesWithExactText('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(6);
    expect(result.length).toBe(0);
  });

  test('should find empty content', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-exact-text.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] td', page);
    const result = await SUT.getHandlesWithExactText('', rootElements);

    // Then
    expect(rootElements.length).toBe(6);
    expect(result.length).toBe(1);
  });
});
