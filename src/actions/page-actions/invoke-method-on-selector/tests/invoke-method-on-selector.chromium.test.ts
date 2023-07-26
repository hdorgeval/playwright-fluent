import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { hasHandleFocus } from '../../../handle-actions/has-handle-focus';
import { defaultInvokeOptions, InvokeOptions } from '../invoke-method-on-selector';
import { defaultVerboseOptions, isHandleChecked } from '../../../handle-actions';

describe('invoke method on selector', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should wait for the selector to exist in DOM before invoking method - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: false });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'invoke-method-on-selector.test.html')}`;
    await page.goto(url);

    const selector = '#dynamically-added-checkbox';
    const options: InvokeOptions = {
      ...defaultInvokeOptions,
    };

    // When
    await SUT.invokeMethodOnSelector('click', selector, page, options);
    const handle = await page.$(selector);

    // Then
    expect(await hasHandleFocus(handle)).toBe(false);
    expect(await isHandleChecked(handle, defaultVerboseOptions)).toBe(true);
  });
});
