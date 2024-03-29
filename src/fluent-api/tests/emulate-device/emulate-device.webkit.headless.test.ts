import { PlaywrightFluent } from '../../playwright-fluent';
import { LaunchOptions } from '../../../actions';
import { getDevice, defaultDevice } from '../../../devices';
describe('Playwright Fluent - emulateDevice', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should target webkit in headless mode with simulated device', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const options: LaunchOptions = {
      headless: true,
    };
    const device = getDevice('iPhone 6 landscape') || defaultDevice;
    const url = 'https://reactstrap.github.io';

    // When
    await p
      .withBrowser(browser)
      .withOptions(options)
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.innerWidth - device.viewport.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.innerHeight - device.viewport.height)).toBeLessThanOrEqual(10);

    // Then default viewport should have (almost) the same size as the browser window
    // const viewport = { width: windowState.innerWidth, height: windowState.innerHeight };
    // expect(Math.abs(viewport.height - windowState.outerHeight)).toBeLessThanOrEqual(132);
    // expect(Math.abs(viewport.width - windowState.outerWidth)).toBeLessThanOrEqual(20);
  });
});
