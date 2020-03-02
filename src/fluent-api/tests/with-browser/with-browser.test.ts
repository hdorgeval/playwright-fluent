import { PlaywrightFluent } from '../../playwright-fluent';
import { BrowserName } from '../../../actions';
declare const window: Window;
describe('Playwright Controller - withBrowser', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should target chrome', async (): Promise<void> => {
    // Given
    const browser = 'chrome';
    const pwc = new PlaywrightFluent();

    // When
    await pwc.withBrowser(browser);

    // Then
    const browserInstance = pwc.currentBrowser();
    const pageInstance = pwc.currentPage();
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
    const pwc = new PlaywrightFluent();

    // When
    await pwc.withBrowser(browser);

    // Then
    const browserInstance = pwc.currentBrowser();
    const pageInstance = pwc.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('HeadlessChrome');
    browserInstance && (await browserInstance.close());
  });

  test('should target firefox', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const pwc = new PlaywrightFluent();

    // When
    await pwc.withBrowser(browser);

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

  test('should target webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const pwc = new PlaywrightFluent();

    // When
    await pwc.withBrowser(browser);

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

  test('should throw an error on unknown browser', async (): Promise<void> => {
    // Given
    const browser = 'yo';
    const pwc = new PlaywrightFluent();

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc.withBrowser(browser as BrowserName);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Browser named 'yo' is unknown. It should be one of 'chrome', 'chromium', 'firefox', 'webkit'";
    expect(result && result.message).toContain(expectedErrorMessage);
    expect((pwc.lastError() || {}).message).toBe(expectedErrorMessage);
  });
});
