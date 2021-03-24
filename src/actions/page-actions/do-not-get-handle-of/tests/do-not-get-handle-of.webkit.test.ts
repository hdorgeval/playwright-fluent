import * as SUT from '..';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../../../../utils';
import { Page, Browser, webkit } from 'playwright';

describe('do-not-get-handle-of', (): void => {
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
    const handle = await SUT.doNotGetHandleOf('foobar', page, defaultWaitUntilOptions);

    // Then
    expect(handle).toBeNull();
  });

  test('should return null when selector does not exist on the page - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.doNotGetHandleOf('foobar', page, defaultWaitUntilOptions);

    // Then
    expect(result).toBeNull();
  });

  test('should throw an error when selector does exist on the page - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      timeoutInMilliseconds: 2000,
    };

    // When
    let result: Error | undefined = undefined;
    try {
      await SUT.doNotGetHandleOf('body', page, options);
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'body' was found in DOM");
  });
});
