import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - pressKey', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
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

  test('should enter a number with decimal digits - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'press-key.test.html')}`;

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click('#fieldNumber')
      .expectThatSelector('#fieldNumber')
      .hasFocus()
      .clearText()
      .pressKey('1')
      .pressKey('2')
      .pressKey('3')
      .pressKey('.')
      .pressKey('4')
      .pressKey('5')
      .expectThatSelector('#fieldNumber')
      .hasValue('123.45');
  });
});
