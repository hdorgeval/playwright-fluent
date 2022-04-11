import * as path from 'path';
import { chromium, firefox, webkit } from 'playwright';
import { PlaywrightFluent } from '../../playwright-fluent';

describe('Playwright Fluent - ctor usage', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  test('should take existing browser and page instance of chromium', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const p = new PlaywrightFluent(browser, page);

    // Then
    expect(p.currentBrowser()).toBe(browser);
    expect(p.currentPage()).toBe(page);
    expect(p.currentFrame()).toBeUndefined();
    await browser.close();
  });

  test('should take existing browser and page instance of firefox', async (): Promise<void> => {
    // Given
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    // const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto('https://google.com');

    // When
    const p = new PlaywrightFluent(browser, page);

    // Then
    expect(p.currentBrowser()).toBe(browser);
    expect(p.currentPage()).toBe(page);
    expect(p.currentFrame()).toBeUndefined();
    await browser.close();
  });

  test('should take existing browser and page instance of webkit', async (): Promise<void> => {
    // Given
    const browser = await webkit.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const p = new PlaywrightFluent(browser, page);

    // Then
    expect(p.currentBrowser()).toBe(browser);
    expect(p.currentPage()).toBe(page);
    expect(p.currentFrame()).toBeUndefined();
    await browser.close();
  });

  test.skip('should take existing browser and page instance of firefox', async (): Promise<void> => {
    // Given
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const p = new PlaywrightFluent(browser, page);

    // Then
    expect(p.currentBrowser()).toBe(browser);
    expect(p.currentPage()).toBe(page);
    expect(p.currentFrame()).toBeUndefined();
    await browser.close();
  });
});
