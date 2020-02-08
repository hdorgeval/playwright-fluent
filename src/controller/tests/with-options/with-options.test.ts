import { PlaywrightController } from '../../controller';
declare const window: Window;
describe('Playwright Controller - withOptions', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should target chromium in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const pwc = new PlaywrightController();

    // When
    await pwc.withBrowser(browser).withOptions({ headless: false });

    // Then
    const browserInstance = pwc.currentBrowser();
    const pageInstance = pwc.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Chrome');
    expect(userAgent).not.toContain('Headless');
    browserInstance && (await browserInstance.close());
  });

  test('should target firefox in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const pwc = new PlaywrightController();

    // When
    await pwc.withBrowser(browser).withOptions({ headless: false });

    // Then
    const browserInstance = pwc.currentBrowser();
    const pageInstance = pwc.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Firefox');
    browserInstance && (await browserInstance.close());
  });

  test('should target webkit in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const pwc = new PlaywrightController();

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
    browserInstance && (await browserInstance.close());
  });
});
