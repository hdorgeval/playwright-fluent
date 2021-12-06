import { PlaywrightFluent } from '../../playwright-fluent';
import { BrowserName } from '../../../actions';
declare const window: Window;
describe('Playwright Fluent - withBrowser', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should target chrome', async (): Promise<void> => {
    // Given
    const browser = 'chrome';
    const p = new PlaywrightFluent();

    // When
    await p.withBrowser(browser);

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('HeadlessChrome');
    browserInstance && (await browserInstance.close());
  });

  test('should target chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const p = new PlaywrightFluent();

    // When
    await p.withBrowser(browser);

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('HeadlessChrome');
    browserInstance && (await browserInstance.close());
  });

  test('should target msedge', async (): Promise<void> => {
    // Given
    const browser = 'msedge';
    const p = new PlaywrightFluent();

    // When
    await p.withBrowser(browser);

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Edg');
    browserInstance && (await browserInstance.close());
  });

  test('should target firefox', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const p = new PlaywrightFluent();

    // When
    await p.withBrowser(browser);

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Firefox');
    browserInstance && (await browserInstance.close());
  });

  test('should target webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const p = new PlaywrightFluent();

    // When
    await p.withBrowser(browser);

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Safari');
    browserInstance && (await browserInstance.close());
  });

  test('should throw an error on unknown browser', async (): Promise<void> => {
    // Given
    const browser = 'yo';
    const p = new PlaywrightFluent();

    // When
    let result: Error | undefined = undefined;
    try {
      await p.withBrowser(browser as BrowserName);
    } catch (error) {
      result = error as Error;
    }

    // Then
    const expectedErrorMessage =
      "Browser named 'yo' is unknown. It should be one of 'chrome', 'chromium', 'chrome-canary', 'firefox', 'webkit'";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect((p.lastError() || {}).message).toBe(expectedErrorMessage);
  });
});
