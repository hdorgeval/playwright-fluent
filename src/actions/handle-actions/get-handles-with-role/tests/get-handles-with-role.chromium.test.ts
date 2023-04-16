import * as path from 'path';
import { chromium } from 'playwright';
import * as SUT from '../index';
import { querySelectorAllInPage } from '../../../page-actions';

describe('get elements with role', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterEach(async (): Promise<void> => {});

  test('should return an empty array when root elements is empty', async (): Promise<void> => {
    // Given

    // When
    const result = await SUT.getHandlesWithRole('foobar', []);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return inputs with the role', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-role.test.html')}`;
    await page.goto(url);

    // When
    const inputElements = await querySelectorAllInPage('[role="row"] input', page);
    const result = await SUT.getHandlesWithRole('foo bar', inputElements);

    // Then
    expect(inputElements.length).toBe(8);
    expect(result.length).toBe(2);
    await browser.close();
  });
  test('should return no elements when role is not found', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-handles-with-role.test.html')}`;
    await page.goto(url);

    // When
    const rootElements = await querySelectorAllInPage('[role="row"] input', page);
    const result = await SUT.getHandlesWithRole('foobar', rootElements);

    // Then
    expect(rootElements.length).toBe(8);
    expect(result.length).toBe(0);
    await browser.close();
  });
});
