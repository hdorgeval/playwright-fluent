import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('get handles with value', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given

    // When
    const result = await SUT.getHandlesWithValue('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return only one element', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-value.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] select', page);
    const result = await SUT.getHandlesWithValue('3', rootElements);

    // Then
    expect(rootElements.length).toBe(3);
    expect(result.length).toBe(1);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'label 3 row3',
    );
  });

  test.skip('should return only two elements', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-value.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage(
      '[role="row"] select, [role="row"] input',
      page,
    );
    const result = await SUT.getHandlesWithValue('2', rootElements);

    // Then
    expect(rootElements.length).toBe(4);
    expect(result.length).toBe(2);
    expect(await result[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toContain(
      'label 2 row 2',
    );
    expect(
      await result[1].evaluate((node) => (node as HTMLSelectElement).getAttribute('data-e2e')),
    ).toBe('foobar');
  });
  test.skip('should return no elements when value is not found', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-value.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage(
      '[role="row"] select, [role="row"] input',
      page,
    );
    const result = await SUT.getHandlesWithValue('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(4);
    expect(result.length).toBe(0);
  });
});
