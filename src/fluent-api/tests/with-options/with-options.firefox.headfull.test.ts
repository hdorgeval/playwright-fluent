import { PlaywrightFluent, LaunchOptions } from '../../playwright-fluent';
declare const window: Window;
describe('Playwright Fluent - withOptions', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should target firefox in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'firefox';

    // When
    await p.withBrowser(browser).withOptions({ headless: false });

    // Then
    const browserInstance = p.currentBrowser();
    const pageInstance = p.currentPage();
    expect(browserInstance).toBeDefined();
    expect(pageInstance).toBeDefined();

    const userAgent =
      pageInstance && (await pageInstance.evaluate(() => window.navigator.userAgent));
    expect(userAgent).toContain('Firefox');
  });

  test.skip('should target firefox in headfull mode with custom window size', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const options: LaunchOptions = {
      headless: false,
      args: ['-height=700', '-width=999'],
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    // outerHeight/outerWidth depends on os platform,
    // it might include an additional scrollbar height
    expect(Math.abs(windowState.outerWidth - 999)).toBeLessThanOrEqual(20);
    expect(Math.abs(windowState.outerHeight - 700)).toBeLessThanOrEqual(40);

    // Then default viewport should have the (almost) same size as the browser window
    const viewport = { width: windowState.innerWidth, height: windowState.innerHeight };
    expect(Math.abs(viewport.height - windowState.outerHeight)).toBeLessThanOrEqual(130);
    expect(Math.abs(viewport.width - windowState.outerWidth)).toBeLessThanOrEqual(20);
  });
});
