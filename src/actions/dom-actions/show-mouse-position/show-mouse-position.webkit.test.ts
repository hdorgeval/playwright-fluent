import { Browser, webkit } from 'playwright';
import { exists } from '..';
import * as SUT from './index';

describe.skip('show-mouse-position', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should show cursor on the page on webkit', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    browser = await webkit.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    await SUT.showMousePosition(page);
    await page.goto(url);

    // Then
    const cursorExists = await exists('playwright-mouse-pointer', page);
    expect(cursorExists).toBe(true);
  });

  test('should show cursor on navigating to another page on webkit', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    browser = await webkit.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    await SUT.showMousePosition(page);
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.goto('https://github.com/');

    // Then
    const cursorExists = await exists('playwright-mouse-pointer', page);
    expect(cursorExists).toBe(true);
  });
});
