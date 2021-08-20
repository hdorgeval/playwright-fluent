import * as SUT from '../../playwright-fluent';
import * as path from 'path';
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
    const checkMeOut = p.selector('label').withText('Check me out');

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
      .hover(checkMeOut)
      .expectThat(checkMeOut.find('input'))
      .isUnchecked()
      // return to first tab
      .switchToPreviousTab()
      .expectThat(checkMeOut)
      .isNotVisible()
      // move back to second tab
      .switchToPreviousTab()
      .expectThat(checkMeOut)
      .isVisible();

    // Then
    expect(p.hasBeenRedirectedToAnotherTab()).toBe(true);
    expect(await p.getCurrentUrl()).toContain('https://reactstrap.github.io/components/form');
  });
});
