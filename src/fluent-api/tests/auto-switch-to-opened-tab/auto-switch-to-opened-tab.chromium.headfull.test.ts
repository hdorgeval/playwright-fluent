import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - click', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should continue test execution on new opened tab - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'auto-switch-to-opened-tab.test.html')}`;
    const checkMeOut = p.selector('label').withText('Check me out').parent().find('input');
    const storyBookIframe = 'iframe#storybook-preview-iframe';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .click(p.selector('a[target="_blank"]').withText('open reactstrap form'))
      .switchToIframe(storyBookIframe)
      .click(checkMeOut)
      .expectThatSelector(checkMeOut)
      .hasFocus();

    // Then
    expect(await p.getCurrentUrl()).toContain('https://reactstrap.github.io');
  });

  test('should detect redirection to another tab - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'auto-switch-to-opened-tab.test.html')}`;

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .click(p.selector('a[target="_blank"]').withText('open reactstrap form'));

    // Then
    expect(p.hasBeenRedirectedToAnotherTab()).toBe(true);
  });
});
