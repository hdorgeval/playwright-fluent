import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('query selector all from handles', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given

    // When
    const result = await SUT.querySelectorAllFromHandles('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return all found elements - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'query-selector-all-from-handles.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.querySelectorAllFromHandles(
      'select[data-test-id="my-select"]',
      rootElements,
    );

    // Then
    expect(result.length).toBe(3);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('1');
    expect(await result[1].evaluate((node) => (node as HTMLSelectElement).value)).toBe('2');
    expect(await result[2].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
  });
  test('should return no elements when child selector is not found - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'query-selector-all-from-handles.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"]', page);
    const result = await SUT.querySelectorAllFromHandles('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(0);
  });
});
