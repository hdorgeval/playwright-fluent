import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - pressKey', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should press key Tab - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'press-key.test.html')}`;

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click('#field1')
      .expectThatSelector('#field1')
      .hasFocus()
      .pressKey('Tab')
      .expectThatSelector('#field2')
      .hasFocus()
      .pressKey('Tab')
      .expectThatSelector('#field3')
      .hasFocus();
  });
});
