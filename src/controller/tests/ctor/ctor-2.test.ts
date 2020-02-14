import { PlaywrightController } from '../../controller';
import { chromium } from 'playwright';
import * as path from 'path';

describe('Playwright Controller - ctor usage', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should be called with both a browser and a page instance - chromium case', async (): Promise<
    void
  > => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const pwc1 = new PlaywrightController(browser);
    const pwc2 = new PlaywrightController(undefined, page);

    // Then
    expect(pwc1.currentBrowser()).toBe(undefined);
    expect(pwc1.currentPage()).toBe(undefined);

    expect(pwc2.currentBrowser()).toBe(undefined);
    expect(pwc2.currentPage()).toBe(undefined);

    await browser.close();
  });
});
