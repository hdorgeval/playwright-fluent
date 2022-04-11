import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import {
  ClickOptions,
  defaultClickOptions,
  defaultVerboseOptions,
  isHandleVisible,
} from '../../../handle-actions';
import { hasHandleFocus } from '../../../handle-actions/has-handle-focus';

describe('click on selector', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should wait for the selector to be enabled before clicking - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'click-on-selector.test.html')}`;
    await page.goto(url);

    const selector = '#dynamically-added-input';
    let handle = await page.$(selector);
    const isSelectorVisibleBeforeClick = await isHandleVisible(handle, defaultVerboseOptions);

    const options: ClickOptions = {
      ...defaultClickOptions,
    };

    // When
    await SUT.clickOnSelector(selector, page, options);
    handle = await page.$(selector);
    const isSelectorVisibleAfterClick = await isHandleVisible(handle, defaultVerboseOptions);

    // Then
    expect(isSelectorVisibleBeforeClick).toBe(false);
    expect(isSelectorVisibleAfterClick).toBe(true);
    expect(await hasHandleFocus(handle)).toBe(true);
  });
});
