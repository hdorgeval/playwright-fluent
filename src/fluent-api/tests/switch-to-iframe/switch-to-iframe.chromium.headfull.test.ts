import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - switchToIframe', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
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

  test('should switch to an iframe targeted by a fluent selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'switch-to-iframe.test.html')}`;
    const selector = p.selector('iframe');
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

  test('should switch to iframe and back to page - chromium', async (): Promise<void> => {
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
      .switchBackToPage()
      .click('input#in-view-port')
      .typeText('hey I am back in the page');

    // Then
    const value = await p.getValueOf('input#in-view-port');
    expect(value).toBe('hey I am back in the page');
  });
});
