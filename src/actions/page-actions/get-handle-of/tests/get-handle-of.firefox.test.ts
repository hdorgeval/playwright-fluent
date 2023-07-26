import { Browser, firefox } from 'playwright';
import * as SUT from '..';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../../../../utils';

describe('get-handle-of', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return handle when selector exists on the page - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getHandleOf('body', page, defaultWaitUntilOptions);

    // Then
    expect(result).toBeDefined();
  });

  test('should throw an error when selector does not exist on the page - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
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
