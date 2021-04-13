import * as SUT from '../index';
import { exists } from '../..';
import { Browser, webkit } from 'playwright';

describe.skip('inject-cursor', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );
  test('should show cursor on the page on webkit', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    browser = await webkit.launch({ headless: true });
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
