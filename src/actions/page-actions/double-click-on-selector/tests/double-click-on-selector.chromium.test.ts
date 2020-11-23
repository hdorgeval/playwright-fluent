import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import {
  DoubleClickOptions,
  defaultDoubleClickOptions,
  defaultVerboseOptions,
  isHandleVisible,
} from '../../../handle-actions';
import { hasHandleFocus } from '../../../handle-actions/has-handle-focus';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('double click on selector', (): void => {
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

  test('should wait for the selector to be enabled before double clicking - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'double-click-on-selector.test.html')}`;
    await page.goto(url);

    const selector = '#dynamically-added-input';
    let handle = await page.$(selector);
    const isSelectorVisibleBeforeClick = await isHandleVisible(handle, defaultVerboseOptions);

    const options: DoubleClickOptions = {
      ...defaultDoubleClickOptions,
    };

    // When
    await SUT.doubleClickOnSelector(selector, page, options);
    handle = await page.$(selector);
    const isSelectorVisibleAfterClick = await isHandleVisible(handle, defaultVerboseOptions);

    // Then
    expect(isSelectorVisibleBeforeClick).toBe(false);
    expect(isSelectorVisibleAfterClick).toBe(true);
    expect(await hasHandleFocus(handle)).toBe(true);
    const selectedText = await page.evaluate(() => (document.getSelection() || '').toString());
    expect(selectedText).toBe('dynamically');
  });
});
