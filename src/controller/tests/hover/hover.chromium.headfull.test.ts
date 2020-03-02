import * as SUT from '../../controller';
import * as path from 'path';
describe('Playwright Controller - hover', (): void => {
  let pwc: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new SUT.PlaywrightFluent();
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

  test('should wait until selector object exists - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'hover.test.html')}`;
    const selector = pwc.selector('input').withValue('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector);

    // Then
    const finalValue = await pwc.getValueOf('#dynamically-added-input');
    expect(finalValue).toBe('I am hovered');
  });

  test('should hover - chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .hover('#exampleEmail')
      .hover('#examplePassword')
      .hover('#exampleSelect')
      .hover('#exampleSelectMulti')
      .hover('"Submit"');

    // Then
    expect(true).toBe(true);
  });
});
