import { PlaywrightFluent } from '../../playwright-fluent';
import { LaunchOptions } from '../../../actions';
import { windowsize } from '../../../devices';
describe('Playwright Fluent - withWindowSize', (): void => {
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
  test('should target chromium in headfull with window size 800x600', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const size = windowsize._800x600;

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withWindowSize(size)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    expect(Math.abs(windowState.outerWidth - size.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.outerHeight - size.height)).toBeLessThanOrEqual(10);
  });

  test('should target chromium in headfull with window size 1280x720', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const size = windowsize._1280x720;

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withWindowSize(size)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    if (windowState.isMaximized) {
      // eslint-disable-next-line no-console
      console.log('1280x720 oversizes actual screen', windowState);
      return;
    }
    expect(Math.abs(windowState.outerWidth - size.width)).toBeLessThanOrEqual(10);
    expect(Math.abs(windowState.outerHeight - size.height)).toBeLessThanOrEqual(10);
  });

  test('should target chromium in headfull with window size 1600x900', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const options: LaunchOptions = {
      headless: false,
    };
    const url = 'https://reactstrap.github.io/components/form';
    const size = windowsize._1600x900;

    // When
    // prettier-ignore
    await p
      .withBrowser(browser)
      .withOptions(options)
      .withWindowSize(size)
      .navigateTo(url);

    // Then
    const windowState = await p.getCurrentWindowState();
    if (windowState.isMaximized) {
      // eslint-disable-next-line no-console
      console.log('1600x900 oversizes actual screen', windowState);
      return;
    }

    expect(Math.abs(windowState.outerWidth - size.width)).toBeLessThanOrEqual(300);
    expect(Math.abs(windowState.outerHeight - size.height)).toBeLessThanOrEqual(200);
  });
});
