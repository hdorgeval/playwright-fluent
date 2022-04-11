import path from 'path';
import { PlaywrightFluent } from '../../playwright-fluent';
describe.skip('Playwright Fluent - withTimezone', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should set Timezone - firefox', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
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
});
