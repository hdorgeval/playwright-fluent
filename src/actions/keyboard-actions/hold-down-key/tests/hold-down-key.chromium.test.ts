import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { pressKey, defaultKeyboardPressOptions } from '../../press-key';
import { sleep } from '../../../../utils';

describe('hold down key', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should hold down key SHIFT - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hold-down-key.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const selector = '#emptyInput';
    await page.click(selector);
    const handle = await page.$(selector);

    // When
    await SUT.holdDownKey('Shift', page);
    await pressKey('KeyA', page, defaultKeyboardPressOptions);
    await pressKey('KeyB', page, defaultKeyboardPressOptions);
    await page.keyboard.up('Shift');
    await pressKey('KeyA', page, defaultKeyboardPressOptions);

    // Then
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle!.evaluate((node) => (node as HTMLInputElement).value)).toBe('ABa');
  });
});
