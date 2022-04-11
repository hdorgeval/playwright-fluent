import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { getClientRectangleOf, showMousePosition } from '../../../dom-actions';
import { ClickOptions, defaultClickOptions } from '../../../handle-actions';

describe('click at position', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should click at position - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'click-at-position.test.html')}`;
    await page.goto(url);

    const inputSelector = '#flexSwitchCheckChecked';
    const switchContainer = '#switch-container';

    const clientRectangle = await getClientRectangleOf(switchContainer, page);
    const xCenter = clientRectangle.left + clientRectangle.width / 2;
    const yCenter = clientRectangle.top + clientRectangle.height / 2;
    const xLeft = clientRectangle.left;

    const input = await page.$(inputSelector);

    const options: ClickOptions = {
      ...defaultClickOptions,
    };

    // Given switch is off
    expect(await input?.isChecked()).toBe(false);

    // When I click at the center of switch container
    await SUT.clickAtPosition({ x: xCenter, y: yCenter }, page, options);

    // Then switch is still off (because the click was outside the label)
    expect(await input?.isChecked()).toBe(false);

    // When I click at the left of the switch container
    await SUT.clickAtPosition({ x: xLeft + 10, y: yCenter }, page, options);

    // Then
    expect(await input?.isChecked()).toBe(true);
  });
});
