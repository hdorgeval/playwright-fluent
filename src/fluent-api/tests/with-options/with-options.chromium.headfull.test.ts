import { PlaywrightFluent, LaunchOptions } from '../../playwright-fluent';
declare const window: Window;
describe('Playwright Fluent - withOptions', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );
  test('should target chromium in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'chromium';

    // When
    await p.withBrowser(browser).withOptions({ headless: false });

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Chrome');
    expect(userAgent).not.toContain('Headless');
  });

  test('should target chromium in headfull mode with custom window size', async (): Promise<
    void
  > => {
    // Given
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
      args: ['--window-size=999,700'],
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    await p
      .withBrowser(browser)
      .withOptions(options)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.outerWidth - 999)).toBeLessThanOrEqual(20);
    expect(Math.abs(windowState.outerHeight - 700)).toBeLessThanOrEqual(40);

    // Then default viewport should have (almost) the same size as the browser window
    const viewport = { width: windowState.innerWidth, height: windowState.innerHeight };
    expect(Math.abs(viewport.height - windowState.outerHeight)).toBeLessThanOrEqual(132);
    expect(Math.abs(viewport.width - windowState.outerWidth)).toBeLessThanOrEqual(20);
  });
});
