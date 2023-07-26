import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - selectByValue(values).in(selector)', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should select an existing option - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .selectByValue('value 2')
      .in(selector);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value 2');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(false);

    const selectedOption = await p.getSelectedOptionOf(selector);

    expect(selectedOption!.selected).toBe(true);

    expect(selectedOption!.label).toBe('label 2');
  });
  test('should select an existing option of a selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in.test.html')}`;
    const selector = p.selector('select').withText('Please select an option');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .selectByValue('value 2')
      .in(selector);

    // Then
    const value = await p.getValueOf('#select');
    expect(value).toBe('value 2');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(false);

    const selectedOption = await selector.selectedOption();

    expect(selectedOption!.selected).toBe(true);

    expect(selectedOption!.label).toBe('label 2');
  });

  test('should wait until option is available - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .selectByValue('value bar')
      .in(selector);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value bar');
  });

  test('should wait until option is available in selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in.test.html')}`;
    const selector = p.selector('select').withText('Please select an option');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .selectByValue('value bar')
      .in(selector);

    // Then
    const selectedOption = await selector.selectedOption();

    expect(selectedOption!.value).toBe('value bar');
  });
});
