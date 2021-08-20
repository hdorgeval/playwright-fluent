import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import {
  defaultSwitchToIframeOptions,
  SwitchToIframeOptions,
} from '../switch-from-handle-to-iframe';
import { Browser, chromium, Page } from 'playwright';
import * as path from 'path';

describe('switch from handle to iframe', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
      browser = undefined;
    }
  });

  test('should throw when selector is undefined - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'switch-from-handle-to-iframe.test.html')}`;
    await page.goto(url);

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      timeoutInMilliseconds: 1000,
    };

    // When
    // Then
    const expectedError = new Error(
      "Cannot switch to iframe from 'foobar' because selector was not found in DOM",
    );

    await SUT.switchFromHandleToIframe(undefined, 'foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is null - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'switch-from-handle-to-iframe.test.html')}`;
    await page.goto(url);

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      timeoutInMilliseconds: 1000,
    };

    // When
    // Then
    const expectedError = new Error(
      "Cannot switch to iframe from 'foobar' because selector was not found in DOM",
    );

    await SUT.switchFromHandleToIframe(null, 'foobar', page, options).catch((error): void =>
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
    await SUT.switchFromHandleToIframe(null, 'foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
  test('should throw when selector is not an iframe - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'switch-from-handle-to-iframe.test.html')}`;
    await page.goto(url);

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
      timeoutInMilliseconds: 2000,
    };

    // When
    // Then
    const expectedError = new Error(
      "Cannot switch to iframe from 'foobar' because this selector does not seem to be an iframe.",
    );

    const iframeHandle = await page.$('div#iframe-label');
    await SUT.switchFromHandleToIframe(iframeHandle, 'foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
