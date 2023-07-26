import * as path from 'path';
import { Browser, chromium } from 'playwright';
import {
  takeFullPageScreenshotAsBase64,
  defaultFullPageScreenshotOptions,
} from '../take-fullpage-screenshot-as-base64';

describe('full page screenshot', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should take screenshot', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    await page.goto(`file:${path.join(__dirname, 'take-fullpage-screenshot-as-base64.test.html')}`);

    // When
    const result = await takeFullPageScreenshotAsBase64(page, defaultFullPageScreenshotOptions);

    // Then
    expect(typeof result).toBe('string');
    expect(result.startsWith('iVBOR')).toBe(true);
    expect(result.endsWith('==') || result.endsWith('CYII=')).toBe(true);
  });
});
