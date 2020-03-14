import * as SUT from '.';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../../../utils';
import { Page, Browser, chromium } from 'playwright';

describe('get-handle-of', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(60000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

  test('should return null when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    const handle = await SUT.getHandleOf('foobar', page, defaultWaitUntilOptions);

    // Then
    expect(handle).toBeNull();
  });

  test('should return handle when selector exists on the page - chromium', async (): Promise<
    void
  > => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getHandleOf('body', page, defaultWaitUntilOptions);

    // Then
    expect(result).toBeDefined();
  });

  test('should return null when selector does not exist on the page - chromium', async (): Promise<
    void
  > => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      timeoutInMilliseconds: 2000,
    };

    // When
    const result = await SUT.getHandleOf('foobar', page, options);

    // Then
    expect(result).toBeNull();
  });
});
