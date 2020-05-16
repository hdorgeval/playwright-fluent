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
});
