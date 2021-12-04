import { PlaywrightFluent } from '../../playwright-fluent';
import { LaunchOptions } from '../../../actions';
import { sizeOf, ViewportSize } from '../../../devices';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isCI = require('is-ci') as boolean;
describe('Playwright Fluent - withViewPort', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should target chromium in headfull with viewport size 800x600', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
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

  test('should target chromium in headfull with viewport size 1280x720', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io';
    const viewport: ViewportSize = {
      ...sizeOf._1280x720,
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

  test('should target chromium in headfull with viewport size 1600x900', async (): Promise<void> => {
    // Given
    if (!isCI) {
      // eslint-disable-next-line no-console
      console.log('test will be ignored because it should be executed only in a CI env');
      return;
    }
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io';
    const viewport: ViewportSize = {
      ...sizeOf._1600x900,
    };
    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withViewport(viewport, {ciOnly: true})
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.innerWidth - viewport.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.innerHeight - viewport.height)).toBeLessThanOrEqual(10);
  });
});
