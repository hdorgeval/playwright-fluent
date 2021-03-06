import { PlaywrightFluent } from '../../playwright-fluent';
import { chromium } from 'playwright';
import * as path from 'path';

describe('Playwright Fluent - ctor usage', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should take existing browser and frame instance of chromium', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    const frameHandle = await page.$('iframe');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const frame = await frameHandle!.contentFrame();
    // When
    const p = new PlaywrightFluent(browser, frame);

    // Then
    expect(p.currentBrowser()).toBe(browser);
    expect(p.currentPage()).toBe(page);
    expect(p.currentFrame()).toBe(frame);
    await browser.close();
  });
});
