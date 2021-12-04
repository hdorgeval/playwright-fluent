import { PlaywrightFluent } from '../../playwright-fluent';
import { LaunchOptions } from '../../../actions';
import { sizeOf } from '../../../devices';
describe.skip('Playwright Fluent - withWindowSize', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should target firefox in headfull mode with window size 800x600', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io';
    const size = sizeOf._800x600;

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withWindowSize(size)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.outerWidth - size.width)).toBeLessThanOrEqual(25);
    expect(Math.abs(windowState.outerHeight - size.height)).toBeLessThanOrEqual(50);
  });
});
