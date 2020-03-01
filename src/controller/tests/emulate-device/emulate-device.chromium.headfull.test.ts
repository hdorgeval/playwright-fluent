import { PlaywrightController } from '../../controller';
import { LaunchOptions } from '../../../actions';
import { getDevice, defaultDevice } from '../../../devices';
describe('Playwright Controller - emulateDevice', (): void => {
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
  test('should target chromium in headfull with simulated device', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const device = getDevice('iPhone 6 landscape') || defaultDevice;

    // When
    await pwc
      .withBrowser(browser)
      .withOptions(options)
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url);

    // Then
    const windowState = await pwc.getCurrentWindowState();
    expect(Math.abs(windowState.innerWidth - device.viewport.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.innerHeight - device.viewport.height)).toBeLessThanOrEqual(10);

    // Then default viewport should have (almost) the same size as the browser window
    const viewport = { width: windowState.innerWidth, height: windowState.innerHeight };
    expect(Math.abs(viewport.height - windowState.outerHeight)).toBeLessThanOrEqual(132);
    expect(Math.abs(viewport.width - windowState.outerWidth)).toBeLessThanOrEqual(20);

    // Then default viewport should have (almost) the same size as the screen size
    const screen = windowState.screen;
    expect(Math.abs(viewport.height - screen.availHeight)).toBeLessThanOrEqual(132);
    expect(Math.abs(viewport.width - screen.availWidth)).toBeLessThanOrEqual(20);
  });
});
