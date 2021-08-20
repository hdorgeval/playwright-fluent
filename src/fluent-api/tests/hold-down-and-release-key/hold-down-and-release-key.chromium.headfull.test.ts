import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - hold and release key', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should hold and release SHIFT key - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'hold-down-and-release-key.test.html')}`;
    const selector = '#emptyInput';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .holdDownKey('Shift')
      .pressKey('KeyA')
      .pressKey('KeyB')
      .releaseKey('Shift')
      .pressKey('KeyA');

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('ABa');
  });
});
