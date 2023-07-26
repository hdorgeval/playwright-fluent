import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';

describe('get elements with placeholder', (): void => {
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
    const result = await SUT.getHandlesWithPlaceholder('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return inputs with the placeholder', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-placeholder.test.html')}`;
    await page.goto(url);

    // When
    const inputElements = await querySelectorAllInPage('[role="row"] input', page);
    const result = await SUT.getHandlesWithPlaceholder('foo bar', inputElements);

    // Then
    expect(inputElements.length).toBe(5);
    expect(result.length).toBe(2);
  });
  test('should return no elements when placeholder is not found', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-placeholder.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] input', page);
    const result = await SUT.getHandlesWithPlaceholder('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(5);
    expect(result.length).toBe(0);
  });
});
