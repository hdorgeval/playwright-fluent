import { Browser, chromium, ElementHandle } from 'playwright';
import * as SUT from '../index';
import { getViewportRectangleOf } from '../../../page-actions';

describe('scroll to handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should do nothing when handle is undefined', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();

    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const previousViewportRectangle = await getViewportRectangleOf(page);
    await SUT.scrollToHandle(handle);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then
    expect(previousViewportRectangle).toMatchObject(currentViewportRectangle || {});
  });

  test('should do nothing when handle is null', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();

    const handle: ElementHandle<Element> | null = null;

    // When
    const previousViewportRectangle = await getViewportRectangleOf(page);
    await SUT.scrollToHandle(handle);
    const currentViewportRectangle = await getViewportRectangleOf(page);

    // Then

    expect(previousViewportRectangle).toMatchObject(currentViewportRectangle || {});
  });
});
