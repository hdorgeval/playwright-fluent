import { PlaywrightFluent } from '../../playwright-fluent';
import path from 'path';
describe('Playwright Fluent - withTimezone', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(50000);
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should set Timezone to Tokyo - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'with-timezone.test.html')}`;
    const selector = '#timedisplay';

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .withTimezone('Asia/Tokyo')
      .navigateTo(url)
      // Then
      .expectThatSelector(selector)
      .hasText('Sun Oct 11 2020 06:26:42 GMT+0900 (Japan Standard Time)');
  });

  test('should set Timezone to Paris - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'with-timezone.test.html')}`;
    const selector = '#timedisplay';

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .withTimezone('Europe/Paris')
      .navigateTo(url)
      // Then
      .expectThatSelector(selector)
      .hasText('Sat Oct 10 2020 23:26:42 GMT+0200 (Central European Summer Time)');
  });
});
