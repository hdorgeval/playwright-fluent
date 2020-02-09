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
      args: ['--window-size=888,666'],
    };

    // When
    await pwc.withBrowser(browser).withOptions(options);

    // Then
    const windowState = await pwc.getCurrentWindowState();

    expect(windowState.outerWidth).toBe(888);
    expect(windowState.outerHeight).toBe(666);
  });

  test('should target firefox in headfull mode with custom window size', async (): Promise<
    void
  > => {
    // Given
    const browser = 'firefox';
    const options: LaunchOptions = {
      headless: false,
      args: ['-height=666', '-width=888'],
    };

    // When
    await pwc.withBrowser(browser).withOptions(options);

    // Then
    const windowState = await pwc.getCurrentWindowState();
    // outerHeight/outerWidth depends on os platform,
    // it might include an additional scrollbar height
    expect(Math.abs(windowState.outerWidth - 888)).toBeLessThanOrEqual(22);
    expect(Math.abs(windowState.outerHeight - 666)).toBeLessThanOrEqual(22);
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
