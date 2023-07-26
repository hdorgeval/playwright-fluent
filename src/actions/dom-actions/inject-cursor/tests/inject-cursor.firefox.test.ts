import { Browser, firefox } from 'playwright';
import * as SUT from '../index';
import { exists } from '../..';

describe('inject-cursor', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should show cursor on the page on firefox', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    await page.goto(url);

    // When
    await SUT.injectCursor(page);
    await SUT.injectCursor(page);
    await SUT.injectCursor(page);
    await SUT.injectCursor(page);

    // Then
    const cursorExists = await exists('playwright-mouse-pointer', page);
    expect(cursorExists).toBe(true);
  });
});
