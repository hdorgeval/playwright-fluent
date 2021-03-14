import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('pause', (): void => {
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

  test('should ignore pause when running on CI and when running headless - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'pause.test.html')}`;
    await page.goto(url);

    // When
    await SUT.pause(page);
  });
});
