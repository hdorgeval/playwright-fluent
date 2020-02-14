import * as SUT from '.';
import { Browser, firefox } from 'playwright';

describe('get-handle-of', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
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
    const result = await SUT.getHandleOf('body', page);

    // Then
    expect(result).toBeDefined();
  });

  test('should return null when selector does not exist on the page - firefox', async (): Promise<
    void
  > => {
    // Given
    browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getHandleOf('foobar', page);

    // Then
    expect(result).toBeNull();
  });

  test('should return null when playright API throws an internal error', async (): Promise<
    void
  > => {
    // Given
    browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    page.$ = () => {
      throw new Error('internal error!');
    };

    // When
    const result = await SUT.getHandleOf('body', page);

    // Then
    expect(result).toBeNull();
  });
});
