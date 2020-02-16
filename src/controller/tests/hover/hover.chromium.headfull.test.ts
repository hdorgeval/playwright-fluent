import * as SUT from '../../controller';
import * as path from 'path';
describe('Playwright Controller - hover', (): void => {
  let pwc: SUT.PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new SUT.PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );
  test('should wait until selector exists - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'hover.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector);

    // Then
    const value = await pwc.getValueOf(selector);
    expect(value).toBe('I am hovered');
  });
});
