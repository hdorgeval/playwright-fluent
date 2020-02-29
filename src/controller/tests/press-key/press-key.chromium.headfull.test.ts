import * as SUT from '../../controller';
import * as path from 'path';
describe('Playwright Controller - pressKey', (): void => {
  let pwc: SUT.PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new SUT.PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );
  test('should press key Tab - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'press-key.test.html')}`;

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click('#field1')
      .expectThat('#field1')
      .hasFocus()
      .pressKey('Tab')
      .expectThat('#field2')
      .hasFocus()
      .pressKey('Tab')
      .expectThat('#field3')
      .hasFocus();
  });
});
