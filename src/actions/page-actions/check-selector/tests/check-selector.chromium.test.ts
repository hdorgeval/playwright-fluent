import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { CheckOptions, defaultCheckOptions, isHandleChecked } from '../../../handle-actions';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('check selector', (): void => {
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

  test('should wait for the selector to be enabled before checking - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'check-selector.test.html')}`;
    await page.goto(url);

    const selector = '#dynamically-added-input';

    const options: CheckOptions = {
      ...defaultCheckOptions,
      verbose: false,
    };

    // When
    await SUT.checkSelector(selector, page, options);
    const handle = await page.$(selector);

    // Then
    expect(await isHandleChecked(handle, { verbose: options.verbose })).toBe(true);
  });
});
