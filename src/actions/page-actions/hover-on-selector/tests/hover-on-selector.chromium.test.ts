import * as SUT from '../index';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import {
  defaultHoverOptions,
  defaultVerboseOptions,
  HoverOptions,
  isHandleVisible,
} from '../../../handle-actions';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('hover on selector', (): void => {
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

  test('should wait for the selector to exists before hovering - chromium', async (): Promise<
    void
  > => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-selector.test.html')}`;
    await page.goto(url);

    const selector = '#dynamically-added';
    let handle = await page.$(selector);
    const isSelectorVisibleBeforeScroll = await isHandleVisible(handle, defaultVerboseOptions);

    const options: HoverOptions = {
      ...defaultHoverOptions,
      verbose: true,
    };

    // When
    await SUT.hoverOnSelector(selector, page, options);
    handle = await page.$(selector);
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
});
