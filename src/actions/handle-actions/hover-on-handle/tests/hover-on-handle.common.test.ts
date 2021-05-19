import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { defaultHoverOptions, HoverOptions } from '../hover-on-handle';
import { Browser, chromium, Page } from 'playwright';
import * as path from 'path';

describe('scroll to handle', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {
    jest.setTimeout(60000);
  });

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
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 1000,
    };

    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on 'foobar' because selector was not found in DOM",
    );

    await SUT.hoverOnHandle(undefined, 'foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is null - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 1000,
    };
    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on 'foobar' because selector was not found in DOM",
    );

    await SUT.hoverOnHandle(null, 'foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when no browser has been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 1000,
    };
    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on 'foobar' because no browser has been launched",
    );

    await SUT.hoverOnHandle(null, 'foobar', page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
