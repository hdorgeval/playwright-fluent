import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { Browser, firefox } from 'playwright';
import * as path from 'path';

// TODO: re-enable these tests on v1.0.0
describe.skip('handle is moving', (): void => {
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
  test('should detect that selector is moving - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'is-handle-moving.test1.html')}`;
    await page.goto(url);
    await page.waitForTimeout(100); // wait for the animation to be started

    // When
    const selector = '#moving';
    const handle = await page.$(selector);
    const isMoving = await SUT.isHandleMoving(handle);

    // Then
    expect(isMoving).toBe(true);
  });

  test('should detect that selector is not moving - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'is-handle-moving.test2.html')}`;
    await page.goto(url);
    await page.waitForTimeout(2000); // wait twice the animation duration

    // When
    const selector = '#moving';
    const handle = await page.$(selector);
    const isMoving = await SUT.isHandleMoving(handle);

    // Then
    expect(isMoving).toBe(false);
  });
});
