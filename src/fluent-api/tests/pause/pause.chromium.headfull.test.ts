import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - pause', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should not pause on CI - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'pause.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .pause()
      .click(selector);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('dynamically added input');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(true);
  });
});
