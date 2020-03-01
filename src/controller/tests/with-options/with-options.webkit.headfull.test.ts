import { PlaywrightController, LaunchOptions } from '../../controller';
declare const window: Window;
describe('Playwright Controller - withOptions', (): void => {
  let pwc: PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should target webkit in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'webkit';

    // When
    await pwc.withBrowser(browser).withOptions({ headless: false });

    // Then
    const browserInstance = pwc.currentBrowser();
    const pageInstance = pwc.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Safari');
  });

  test.skip('should target webkit in headfull mode with custom window size', async (): Promise<
    void
  > => {
    // Given
    const browser = 'webkit';
    const options: LaunchOptions = {
      headless: false,
      args: ['--window-size=888,666'],
    };

    // When
    await pwc.withBrowser(browser).withOptions(options);

    // Then
    const windowState = await pwc.getCurrentWindowState();

    expect(windowState.outerWidth).toBe(888);
    expect(windowState.outerHeight).toBe(666);
  });
});
