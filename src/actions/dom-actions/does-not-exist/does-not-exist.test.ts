import * as SUT from '.';
import { Page, Browser, chromium } from 'playwright';

describe('doesNotExist', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check that 'foobar' does not exist because no browser has been launched",
    );
    await SUT.doesNotExist('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return false when selector exists on the page - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.doesNotExist('body', page);

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector does not exist on the page - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.doesNotExist('foobar', page);

    // Then
    expect(result).toBe(true);
  });

  test('should return true when playright API throws an internal error', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    page.$ = () => {
      throw new Error('internal error!');
    };

    // When
    const result = await SUT.doesNotExist('body', page);

    // Then
    expect(result).toBe(true);
  });
});
