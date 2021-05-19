import * as SUT from '../index';
import { Browser, chromium } from 'playwright';

describe('get-focused-handle', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return handle when focused element exists on the page - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getFocusedHandle(page);

    // Then
    expect(result).toBeDefined();
  });
});
