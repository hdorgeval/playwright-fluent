import { PlaywrightController } from '../../controller';
declare const window: Window;
describe('Playwright Controller - withBrowser', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should target chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const pwc = new PlaywrightController();

    // When
    await pwc.withBrowser(browser);

    // Then
    const createdBrowser = pwc.currentBrowser();
    expect(pwc.currentBrowser()).toBeDefined();
    const context = createdBrowser && (await createdBrowser.newContext());
    const page = context && (await context.newPage());
    const userAgent = page && (await page.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('HeadlessChrome');
    createdBrowser && (await createdBrowser.close());
  });

  test('should target firefox', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const pwc = new PlaywrightController();

    // When
    await pwc.withBrowser(browser);

    // Then
    const createdBrowser = pwc.currentBrowser();
    expect(pwc.currentBrowser()).toBeDefined();
    const context = createdBrowser && (await createdBrowser.newContext());
    const page = context && (await context.newPage());
    const userAgent = page && (await page.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Firefox');
    createdBrowser && (await createdBrowser.close());
  });

  test('should target webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const pwc = new PlaywrightController();

    // When
    await pwc.withBrowser(browser);

    // Then
    const createdBrowser = pwc.currentBrowser();
    expect(pwc.currentBrowser()).toBeDefined();
    const context = createdBrowser && (await createdBrowser.newContext());
    const page = context && (await context.newPage());
    const userAgent = page && (await page.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Safari');
    createdBrowser && (await createdBrowser.close());
  });
});
