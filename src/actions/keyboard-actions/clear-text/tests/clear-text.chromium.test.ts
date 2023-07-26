import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { injectCursor } from '../../../dom-actions/inject-cursor';
import { defaultClearTextOptions } from '../index';

describe('clear-text', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should clear text that is inside an iframe - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    await page.goto(url);
    const frameSelector = 'iframe';
    const frameHandle = await page.$(frameSelector);
    const frame = await frameHandle?.contentFrame();
    await injectCursor(frame);
    frameHandle?.hover();

    const selector = '#input-inside-iframe';

    const handle = await frame!.$(selector);
    await handle?.hover();
    await handle?.click();

    // When

    await SUT.clearText(frame!, defaultClearTextOptions);

    // Then

    expect(await handle!.evaluate((node) => (node as HTMLInputElement).value)).toBe('');
  });
});
