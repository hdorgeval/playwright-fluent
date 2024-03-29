import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - switchToPreviousTab', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should be able to switch back to previous tab - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'switch-to-previous-tab.test.html')}`;
    const checkMeOut = p.selector('label').withText('Check me out').parent().find('input');
    const storyBookIframe = 'iframe#storybook-preview-iframe';

    // When
    await p
      // open first tab
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      // should open https://reactstrap.github.io/components/form in a new tab
      .click(p.selector('a[target="_blank"]').withText('open reactstrap form'))
      .switchToIframe(storyBookIframe)
      .hover(checkMeOut)
      .expectThat(checkMeOut)
      .isUnchecked()
      .switchBackToPage()
      // return to first tab
      .switchToPreviousTab()
      .expectThat(checkMeOut)
      .isNotVisible()
      // move back to second tab
      .switchToPreviousTab()
      .switchToIframe(storyBookIframe)
      .expectThat(checkMeOut)
      .isVisible();

    // Then
    expect(p.hasBeenRedirectedToAnotherTab()).toBe(true);
    expect(await p.getCurrentUrl()).toContain('https://reactstrap.github.io');
  });
});
