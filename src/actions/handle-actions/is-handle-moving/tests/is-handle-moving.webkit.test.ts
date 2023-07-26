import * as path from 'path';
import { Browser, webkit } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { sleep } from '../../../../utils';

describe.skip('handle is moving', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should detect that selector is moving - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'is-handle-moving.test1.html')}`;
    await page.goto(url);
    await sleep(100); // wait for the animation to be started

    // When
    const selector = '#moving';
    const handle = await page.$(selector);
    const isMoving = await SUT.isHandleMoving(handle);

    // Then
    expect(isMoving).toBe(true);
  });

  test('should detect that selector is not moving - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'is-handle-moving.test2.html')}`;
    await page.goto(url);
    await sleep(2000); // wait twice the animation duration

    // When
    const selector = '#moving';
    const handle = await page.$(selector);
    const isMoving = await SUT.isHandleMoving(handle);

    // Then
    expect(isMoving).toBe(false);
  });
});
