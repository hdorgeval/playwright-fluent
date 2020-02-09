import { PlaywrightController } from '../../controller';
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
  test('should target chromium in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'chromium';

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
  });

  test('should target firefox in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'firefox';

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
  });

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
});
