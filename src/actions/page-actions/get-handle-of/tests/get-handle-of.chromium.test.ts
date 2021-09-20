import * as SUT from '..';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../../../../utils';
import { Page, Browser, chromium } from 'playwright';

describe('get-handle-of', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return null when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    const handle = await SUT.getHandleOf('foobar', page, defaultWaitUntilOptions);

    // Then
    expect(handle).toBeNull();
  });

  test('should return handle when selector exists on the page - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getHandleOf('body', page, defaultWaitUntilOptions);

    // Then
    expect(result).toBeDefined();
  });

  test('should throw an error when selector does not exist on the page - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      timeoutInMilliseconds: 2000,
    };

    // When
    let result: Error | undefined = undefined;
    try {
      await SUT.getHandleOf('foobar', page, options);
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM");
  });
});
