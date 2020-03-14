import * as SUT from '../index';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import { isHandleVisible, defaultVerboseOptions } from '../../is-handle-visible';
import { defaultHoverOptions, HoverOptions } from '../hover-on-handle';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('hover on handle', (): void => {
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

  test('should hover on a selector that is out of viewport - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#out-of-view-port';
    const handle = await page.$(selector);
    const isSelectorVisibleBeforeScroll = await isHandleVisible(handle, defaultVerboseOptions);

    const options: HoverOptions = {
      ...defaultHoverOptions,
    };

    // When
    await SUT.hoverOnHandle(handle, selector, page, options);
    const isSelectorVisibleAfterScroll = await isHandleVisible(handle, defaultVerboseOptions);

    // Then
    expect(isSelectorVisibleBeforeScroll).toBe(false);
    expect(isSelectorVisibleAfterScroll).toBe(true);
    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._x - expectedX)).toBeLessThan(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._y - expectedY)).toBeLessThan(1);
  });

  test('should throw when selector is hidden - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#hidden';
    const handle = await page.$(selector);
    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 1000,
    };
    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on '#hidden' because this selector is not visible",
    );

    await SUT.hoverOnHandle(handle, selector, page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is always moving - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#moving';
    const handle = await page.$(selector);

    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 500,
    };

    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on '#moving' because this selector is always moving",
    );
    await SUT.hoverOnHandle(handle, selector, page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should wait for selector to stop moving - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#moving';
    const handle = await page.$(selector);

    // When
    await SUT.hoverOnHandle(handle, selector, page, SUT.defaultHoverOptions);

    // Then
    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._x - expectedX)).toBeLessThan(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Math.abs((page.mouse as any)._y - expectedY)).toBeLessThan(1);
  });
});
