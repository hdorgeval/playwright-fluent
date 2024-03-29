import { PlaywrightFluent } from '../../playwright-fluent';
import { LaunchOptions } from '../../../actions';
import { sizeOf, ViewportSize } from '../../../devices';
describe('Playwright Fluent - withViewPort', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should target firefox in headfull mode with viewport size 800x600', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io';
    const viewport: ViewportSize = {
      ...sizeOf._800x600,
    };

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withViewport(viewport)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.innerWidth - viewport.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.innerHeight - viewport.height)).toBeLessThanOrEqual(10);
  });

  test('should target firefox in headfull mode with viewport size 1920x1440', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io';
    const viewport: ViewportSize = {
      ...sizeOf._1920x1440,
    };

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withViewport(viewport)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.innerWidth - viewport.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.innerHeight - viewport.height)).toBeLessThanOrEqual(10);
  });
});
