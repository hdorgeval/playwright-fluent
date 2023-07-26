import { Browser, webkit } from 'playwright';
import * as SUT from '../index';
import { ViewportRect } from '../index';

describe('get viewport rectangle of page', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should return defaultViewport - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    // When
    const result = await SUT.getViewportRectangleOf(page);

    // Then
    const defaultViewportRectangle: ViewportRect = {
      height: 720,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      width: 1280,
    };
    const defaultViewportRectangleOnCI: ViewportRect = {
      height: 720,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      width: 1024,
    };
    expect(result).toBeDefined();

    expect(result!.height).toBe(defaultViewportRectangle.height);
    expect(
      result!.width === defaultViewportRectangle.width ||
        result!.width === defaultViewportRectangleOnCI.width,
    ).toBe(true);
  });
});
