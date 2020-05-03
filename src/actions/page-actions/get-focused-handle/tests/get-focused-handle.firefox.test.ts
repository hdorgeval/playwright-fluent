import * as SUT from '../index';
import { Browser, firefox } from 'playwright';

describe('get-focused-handle', (): void => {
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

  test('should return handle when selector exists on the page - firefox', async (): Promise<
    void
  > => {
    // Given
    browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getFocusedHandle(page);

    // Then
    expect(result).toBeDefined();
  });
});
