import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';

describe('get previous siblings', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given

    // When
    const result = await SUT.getPreviousSiblingsOf([]);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should get previous siblings', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-previous-sibling-of-handles.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.getPreviousSiblingsOf(rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(await result[0].evaluate((node) => (node as HTMLElement).tagName)).toContain('TR');
    expect(
      await result[0].evaluate((node) => (node as HTMLElement).getAttribute('data-test-id')),
    ).toBe('row1');
    expect(await result[1].evaluate((node) => (node as HTMLElement).tagName)).toContain('TR');
    expect(
      await result[1].evaluate((node) => (node as HTMLElement).getAttribute('data-test-id')),
    ).toBe('row2');
  });

  test('should get previous sibling', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-previous-sibling-of-handles.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage(
      'select[data-test-id="my-select2"] option',
      page,
    );
    const lastOption = rootElements[2];
    const result = await SUT.getPreviousSiblingsOf([lastOption]);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(await lastOption.evaluate((node) => (node as HTMLElement).tagName)).toContain('OPTION');
    expect(await lastOption.evaluate((node) => (node as HTMLElement).innerText)).toBe(
      'Select 2 - label 3',
    );
    const previousOption = result[0];
    expect(await previousOption.evaluate((node) => (node as HTMLElement).tagName)).toContain(
      'OPTION',
    );
    expect(await previousOption.evaluate((node) => (node as HTMLElement).innerText)).toBe(
      'Select 2 - label 2',
    );
  });
  test('should return no elements when sibling is not found', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-previous-sibling-of-handles.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('html', page);
    const result = await SUT.getPreviousSiblingsOf(rootElements);

    // Then
    expect(rootElements.length).toBe(1);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
