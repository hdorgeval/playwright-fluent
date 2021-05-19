import * as SUT from '../index';
import { ViewportRect } from '../index';
import { Browser, chromium } from 'playwright';

describe('get viewport rectangle of page', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test('should return defaultViewport - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
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
    expect(result).toBeDefined();
    expect(result).toMatchObject(defaultViewportRectangle);
  });
});
