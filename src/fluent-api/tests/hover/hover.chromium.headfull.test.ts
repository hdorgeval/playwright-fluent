import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - hover', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait until selector exists - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'hover.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('I am hovered');
  });

  test('should wait until selector object exists - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'hover.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector);

    // Then
    const finalValue = await p.getValueOf('#dynamically-added-input');
    expect(finalValue).toBe('I am hovered');
  });

  test('should hover - chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/?path=/docs/components-forms--input';
    const storyBookIframe = 'iframe#storybook-preview-iframe';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .switchToIframe(storyBookIframe)
      .hover('#exampleEmail')
      .hover('#examplePassword')
      .hover('#exampleSelect')
      .hover('#exampleSelectMulti')
      .hover('"Submit"');

    // Then
    expect(true).toBe(true);
  });
});
