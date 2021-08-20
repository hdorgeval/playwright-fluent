import { PlaywrightFluent, LaunchOptions } from '../../playwright-fluent';
declare const window: Window;
describe.skip('Playwright Fluent - withOptions', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should target webkit in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'webkit';

    // When
    await p.withBrowser(browser).withOptions({ headless: false });

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Safari');
  });

  test('should target webkit in headfull mode with custom window size', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const options: LaunchOptions = {
      headless: false,
      args: ['--window-size=888,666'],
    };

    // When
    await p.withBrowser(browser).withOptions(options);

    // Then
    const windowState = await p.getCurrentWindowState();

    expect(windowState.outerWidth).toBe(888);
    expect(windowState.outerHeight).toBe(666);
  });
});
