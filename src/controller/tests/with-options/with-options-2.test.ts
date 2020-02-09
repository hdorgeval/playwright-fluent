import { PlaywrightController } from '../../controller';
import { LaunchOptions } from '../../../actions';
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
    await pwc
      .withBrowser(browser)
      .withOptions(options)
      .navigateTo(url);

    // Then
    const windowState = await pwc.getCurrentWindowState();
    expect(Math.abs(windowState.outerWidth - 999)).toBeLessThanOrEqual(20);
    expect(Math.abs(windowState.outerHeight - 700)).toBeLessThanOrEqual(40);

    // Then default viewport should have (almost) the same size as the browser window
    const viewport = { width: windowState.innerWidth, height: windowState.innerHeight };
    expect(Math.abs(viewport.height - windowState.outerHeight)).toBeLessThanOrEqual(130);
    expect(Math.abs(viewport.width - windowState.outerWidth)).toBeLessThanOrEqual(20);
  });

  test('should target firefox in headfull mode with custom window size', async (): Promise<
    void
  > => {
    // Given
    const browser = 'firefox';
    const options: LaunchOptions = {
      headless: false,
      args: ['-height=700', '-width=999'],
    };
    const url = 'https://reactstrap.github.io/components/form';

    // When
    await pwc
      .withBrowser(browser)
      .withOptions(options)
      .navigateTo(url);

    // Then
    const windowState = await pwc.getCurrentWindowState();
    // outerHeight/outerWidth depends on os platform,
    // it might include an additional scrollbar height
    expect(Math.abs(windowState.outerWidth - 999)).toBeLessThanOrEqual(20);
    expect(Math.abs(windowState.outerHeight - 700)).toBeLessThanOrEqual(40);

    // Then default viewport should have the (almost) same size as the browser window
    const viewport = { width: windowState.innerWidth, height: windowState.innerHeight };
    expect(Math.abs(viewport.height - windowState.outerHeight)).toBeLessThanOrEqual(130);
    expect(Math.abs(viewport.width - windowState.outerWidth)).toBeLessThanOrEqual(20);
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
