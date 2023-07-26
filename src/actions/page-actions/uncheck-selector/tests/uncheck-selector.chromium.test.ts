import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { CheckOptions, defaultCheckOptions, isHandleChecked } from '../../../handle-actions';

describe('uncheck selector', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should wait for the selector to be enabled before unchecking - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'uncheck-selector.test.html')}`;
    await page.goto(url);

    const selector = '#dynamically-added-input';

    const options: CheckOptions = {
      ...defaultCheckOptions,
      verbose: false,
    };

    // When
    await SUT.uncheckSelector(selector, page, options);
    const handle = await page.$(selector);

    // Then
    expect(await isHandleChecked(handle, { verbose: options.verbose })).toBe(false);
  });
});
