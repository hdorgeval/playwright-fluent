import * as SUT from '../index';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import { isHandleVisible, defaultVerboseOptions } from '../../is-handle-visible';
import { defaultSwitchToIframeOptions, SwitchToIframeOptions } from '../index';
import { hoverOnHandle } from '../../hover-on-handle';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('switch from handle to iframe', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should switch to iframe - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'switch-from-handle-to-iframe.test.html')}`;
    await page.goto(url);
    const frameSelector = 'iframe';
    const frameHandle = await page.$(frameSelector);
    const selector = '#inside-iframe';

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
    };

    // When
    const frame = await SUT.switchFromHandleToIframe(frameHandle, frameSelector, page, options);
    const handle = await frame.$(selector);
    await hoverOnHandle(handle, selector, frame, options);
    const isSelectorVisibleAfterScroll = await isHandleVisible(handle, defaultVerboseOptions);

    // Then
    expect(frame).toBeDefined();
    expect(isSelectorVisibleAfterScroll).toBe(true);

    const mousePositionClientRectangle = await getClientRectangleOf(
      'playwright-mouse-pointer',
      frame,
    );
    const mouseX = mousePositionClientRectangle.left + mousePositionClientRectangle.width / 2;
    const mouseY = mousePositionClientRectangle.top + mousePositionClientRectangle.height / 2;

    const currentClientRectangle = await getClientRectangleOf(selector, frame);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;
    expect(Math.abs(mouseX - expectedX)).toBeLessThanOrEqual(1);
    expect(Math.abs(mouseY - expectedY)).toBeLessThanOrEqual(1);
  });
});
