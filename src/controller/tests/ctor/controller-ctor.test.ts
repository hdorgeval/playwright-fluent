import { PlaywrightController } from '../../controller';
import { sleep } from '../../../utils/sleep';
import { chromium, firefox, webkit } from 'playwright';
import * as path from 'path';

describe('Playwright Controller - ctor usage', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should take existing browser and page instance of chromium', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'controller-ctor.test.html')}`;
    const page = await context.newPage(url);

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });

  test('should take existing browser and page instance of firefox', async (): Promise<void> => {
    // Given
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    // const url = `file:${path.join(__dirname, 'controller-ctor.test.html')}`;
    const page = await context.newPage('https://google.com');

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });

  test('should take existing browser and page instance of webkit', async (): Promise<void> => {
    // Given
    const browser = await webkit.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'controller-ctor.test.html')}`;
    const page = await context.newPage(url);

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });

  test.only('should be called with both a browser and a page instance', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'controller-ctor.test.html')}`;
    const page = await context.newPage(url);

    // When
    // const pwc1 = new PlaywrightController(browser);
    // const pwc2 = new PlaywrightController(undefined, page);

    // // Then
    // expect(pwc1.currentBrowser()).toBe(undefined);
    // expect(pwc1.currentPage()).toBe(undefined);

    // expect(pwc2.currentBrowser()).toBe(undefined);
    // expect(pwc2.currentPage()).toBe(undefined);
    expect(page).toBeDefined();
    await sleep(5000);
    await browser.close();
  });

  test.skip('should take existing browser and page instance of firefox', async (): Promise<
    void
  > => {
    // Given
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'controller-ctor.test.html')}`;
    const page = await context.newPage(url);

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });
});
