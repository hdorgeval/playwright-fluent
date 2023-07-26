import * as path from 'path';
import { chromium } from 'playwright';
import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';

describe('get elements with aria-label', (): void => {
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {});

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given

    // When
    const result = await SUT.getHandlesWithAriaLabel('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return inputs with the aria-label', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-aria-label.test.html')}`;
    await page.goto(url);

    // When
    const inputElements = await querySelectorAllInPage('[role="row"] input', page);
    const result = await SUT.getHandlesWithAriaLabel('foo bar', inputElements);

    // Then
    expect(inputElements.length).toBe(8);
    expect(result.length).toBe(2);
    await browser.close();
  });
  test('should return no elements when aria-label is not found', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-aria-label.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] input', page);
    const result = await SUT.getHandlesWithAriaLabel('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(8);
    expect(result.length).toBe(0);
    await browser.close();
  });
});
