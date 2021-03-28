import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { defaultSwitchToIframeOptions, SwitchToIframeOptions } from '../../../handle-actions';
import { Browser, chromium, Page } from 'playwright';
import * as path from 'path';

describe('switch from selector to iframe', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {
    jest.setTimeout(60000);
  });

  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
        browser = undefined;
      }
    },
  );

  test('should throw when selector is not found - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'switch-from-selector-to-iframe.test.html')}`;
    await page.goto(url);

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      timeoutInMilliseconds: 1000,
    };

    // When
    // Then
    const expectedError = new Error("Selector 'foobar' was not found in DOM");

    await SUT.switchFromSelectorToIframe('foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when no browser has been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      timeoutInMilliseconds: 1000,
    };
    // When
    // Then
    const expectedError = new Error(
      "Cannot switch to iframe from 'foobar' because no browser has been launched",
    );
    await SUT.switchFromSelectorToIframe('foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
  test('should throw when selector is not an iframe - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'switch-from-selector-to-iframe.test.html')}`;
    await page.goto(url);

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      timeoutInMilliseconds: 2000,
    };

    const iframeSelector = 'div#iframe-label';
    // When
    // Then
    const expectedError = new Error(
      `Cannot switch to iframe from '${iframeSelector}' because this selector does not seem to be an iframe.`,
    );

    await SUT.switchFromSelectorToIframe(iframeSelector, page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
