import * as SUT from '../index';
import { getViewportRectangleOf } from '../../../page-actions';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import { isHandleVisible, defaultVerboseOptions } from '../../is-handle-visible';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('scroll to handle', (): void => {
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

  test('should scroll to a selector that is out of viewport - chromium', async (): Promise<
    void
  > => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);
    await page.waitFor(1000);

    const selector = '#out-of-view-port';

    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    const handle = await page.$(selector);
    const isSelectorVisibleBeforeScroll = await isHandleVisible(handle, defaultVerboseOptions);

    // When
    await SUT.scrollToHandle(handle);
    await page.waitFor(2000);

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);
    const isSelectorVisibleAfterScroll = await isHandleVisible(handle, defaultVerboseOptions);

    // Then
    expect(isSelectorVisibleBeforeScroll).toBe(false);
    expect(isSelectorVisibleAfterScroll).toBe(true);
    expect(previousClientRectangle.top).toBeGreaterThan(currentClientRectangle.top);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(previousViewportRectangle!.pageTop).toBe(0);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(currentViewportRectangle!.pageTop).toBeGreaterThan(1000);
  });

  test('should not scroll to a hidden selector - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);
    await page.waitFor(1000);

    const selector = '#hidden';
    const handle = await page.$(selector);

    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    await SUT.scrollToHandle(handle);
    await page.waitFor(2000);

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousClientRectangle).toMatchObject(currentClientRectangle);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(previousViewportRectangle!.pageTop).toBe(0);
    expect(currentViewportRectangle).toMatchObject(previousViewportRectangle || {});
  });

  test('should scroll to a transparent selector - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'scroll-to-handle.test.html')}`;
    await page.goto(url);
    await page.waitFor(1000);

    const selector = '#transparent';
    const handle = await page.$(selector);

    const previousClientRectangle = await getClientRectangleOf(selector, page);
    const previousViewportRectangle = await getViewportRectangleOf(page);

    // When
    await SUT.scrollToHandle(handle);
    await page.waitFor(2000);

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousClientRectangle.top).toBeGreaterThan(currentClientRectangle.top);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(previousViewportRectangle!.pageTop).toBe(0);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(currentViewportRectangle!.pageTop).toBeGreaterThan(1000);
  });
});
