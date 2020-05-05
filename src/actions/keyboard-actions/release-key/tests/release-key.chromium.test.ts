import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { pressKey, defaultKeyboardPressOptions } from '../../press-key';
import { holdDownKey } from '../../hold-down-key';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('release key', (): void => {
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

  test('should hold down and release SHIFT key - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'release-key.test.html')}`;
    await page.goto(url);
    await page.waitForTimeout(1000);

    const selector = '#emptyInput';
    await page.click(selector);
    const handle = await page.$(selector);

    // When
    await holdDownKey('Shift', page);
    await pressKey('KeyA', page, defaultKeyboardPressOptions);
    await pressKey('KeyB', page, defaultKeyboardPressOptions);
    await SUT.releaseKey('Shift', page);
    await pressKey('KeyA', page, defaultKeyboardPressOptions);

    // Then
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle!.evaluate((node) => (node as HTMLInputElement).value)).toBe('ABa');
  });
});
