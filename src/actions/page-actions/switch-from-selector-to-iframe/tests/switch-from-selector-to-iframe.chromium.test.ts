import * as SUT from '../index';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import { defaultSwitchToIframeOptions, SwitchToIframeOptions } from '../../../handle-actions';
import { hoverOnSelector } from '../../hover-on-selector';
import { isSelectorVisible } from '../../is-selector-visible';
import { defaultWaitUntilOptions } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('switch from selector to iframe', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {
    jest.setTimeout(30000);
  });

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
    const url = `file:${path.join(__dirname, 'switch-from-selector-to-iframe.test.html')}`;
    await page.goto(url);
    const frameSelector = 'iframe';
    const selector = '#inside-iframe';

    const options: SwitchToIframeOptions = {
      ...defaultSwitchToIframeOptions,
    };

    // When
    const frame = await SUT.switchFromSelectorToIframe(frameSelector, page, options);
    await hoverOnSelector(selector, frame, options);
    const isSelectorVisibleAfterScroll = await isSelectorVisible(
      selector,
      frame,
      defaultWaitUntilOptions,
    );

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
