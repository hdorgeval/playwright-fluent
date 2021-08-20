import * as SUT from '../index';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import {
  defaultHoverOptions,
  defaultVerboseOptions,
  HoverOptions,
  isHandleVisible,
} from '../../../handle-actions';
import { Browser, webkit } from 'playwright';
import * as path from 'path';

describe('hover on selector', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should wait for the selector to exists before hovering - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
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
    };

    // When
    await SUT.hoverOnSelector(selector, page, options);
    handle = await page.$(selector);
    const isSelectorVisibleAfterScroll = await isHandleVisible(handle, defaultVerboseOptions);

    // Then
    expect(isSelectorVisibleBeforeScroll).toBe(false);
    expect(isSelectorVisibleAfterScroll).toBe(true);

    const mousePositionClientRectangle = await getClientRectangleOf(
      'playwright-mouse-pointer',
      page,
    );
    const mouseX = mousePositionClientRectangle.left + mousePositionClientRectangle.width / 2;
    const mouseY = mousePositionClientRectangle.top + mousePositionClientRectangle.height / 2;

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;
    expect(Math.abs(mouseX - expectedX)).toBeLessThanOrEqual(1);
    expect(Math.abs(mouseY - expectedY)).toBeLessThanOrEqual(1);
  });
});
