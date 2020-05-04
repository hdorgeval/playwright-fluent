import * as SUT from '..';
import { WaitUntilOptions, defaultWaitUntilOptions } from '../../../../utils';
import { Browser, webkit } from 'playwright';

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

  test('should return handle when selector exists on the page - webkit', async (): Promise<
    void
  > => {
    // Given
    browser = await webkit.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getHandleOf('body', page, defaultWaitUntilOptions);

    // Then
    expect(result).toBeDefined();
  });

  test('should throw an error when selector does not exist on the page - webkit', async (): Promise<
    void
  > => {
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
      await SUT.getHandleOf('foobar', page, options);
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM");
  });
});
