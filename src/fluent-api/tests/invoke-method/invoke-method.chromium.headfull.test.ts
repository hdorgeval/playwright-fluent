import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - invoke method on selector', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should invoke click method on selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'invoke-method.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled()
      .invokeMethod('click', selector);

    // Then
    const isChecked = await p.isChecked(selector);
    expect(isChecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isChecked();
  });

  test('should invoke click method on selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'invoke-method.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled()
      .invokeMethod('click', selector);

    // Then
    const isChecked = await selector.isChecked();
    expect(isChecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isChecked();
  });
});
