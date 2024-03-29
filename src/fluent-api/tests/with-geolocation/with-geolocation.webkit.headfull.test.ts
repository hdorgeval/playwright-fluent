import { PlaywrightFluent } from '../../playwright-fluent';
describe.skip('Playwright Fluent - withGeolocation', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should show location', async (): Promise<void> => {
    // Given
    const browser = 'webkit';

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .withGeolocation({ longitude: 12.492507, latitude: 41.889938 })
      .withPermissions('geolocation')
      .navigateTo('https://www.openstreetmap.org/')
      .click('.control-locate');

    // Then
    const currentUrl = await p.getCurrentUrl();
    expect(currentUrl).toContain('/#map=19/41.88994/12.49251');
  });
});
