import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - click', (): void => {
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
  test('should continue test execution on new opened tab - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'auto-switch-to-opened-tab.test.html')}`;
    const checkMeOut = p.selector('label').withText('Check me out');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .click(p.selector('a[target="_blank"]').withText('open reactstrap form'))
      .click(checkMeOut)
      .expectThatSelector(checkMeOut.find('input'))
      .hasFocus();

    // Then
    expect(await p.getCurrentUrl()).toContain('https://reactstrap.github.io/components/form');
  });
});
