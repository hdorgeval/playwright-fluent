import * as SUT from '../index';
import { ViewportRect } from '../index';
import { Browser, firefox } from 'playwright';

describe('get viewport rectangle of page', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });
  test.skip('should return defaultViewport - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: false });
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();

    // When
    const result = await SUT.getViewportRectangleOf(page);

    // Then
    const defaultViewportRectangle: ViewportRect = {
      height: 600,
      offsetLeft: 0,
      offsetTop: 0,
      pageLeft: 0,
      pageTop: 0,
      scale: 1,
      width: 800,
    };
    expect(result).toBeDefined();
    expect(result).toMatchObject(defaultViewportRectangle);
  });
});
