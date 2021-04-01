import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - switchToIframe', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );
  test('should switch to iframe - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'switch-to-iframe.test.html')}`;
    const selector = 'iframe';
    const inputInIframe = '#input-inside-iframe';
    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .switchToIframe(selector)
      .expectThat(inputInIframe)
      .hasValue('I am in an iframe')
      .click(inputInIframe)
      .typeText('foobar')
      .expectThat(inputInIframe)
      .hasValue('foobar');

    // Then
    const value = await p.getValueOf(inputInIframe);
    expect(value).toBe('foobar');
  });
});
