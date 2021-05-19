import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - select(label).in(selector)', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should select an existing option - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .select('label 2')
      .in(selector);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value2');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(false);

    const allOptions = await p.getAllOptionsOf(selector);
    expect(Array.isArray(allOptions)).toBe(true);
    const selectedOption = allOptions.find((option) => option.selected);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.selected).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.label).toBe('label 2');
  });
  test('should select an existing option of a selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in.test.html')}`;
    const selector = p.selector('select').withText('Please select an option');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .select('label 2')
      .in(selector);

    // Then
    const value = await p.getValueOf('#select');
    expect(value).toBe('value2');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(false);

    const allOptions = await selector.options();
    expect(Array.isArray(allOptions)).toBe(true);
    const selectedOption = allOptions.find((option) => option.selected);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.selected).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.label).toBe('label 2');
  });

  test('should wait until option is available - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .select('label bar')
      .in(selector);

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('bar');
  });

  test('should wait until option is available in selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in.test.html')}`;
    const selector = p.selector('select').withText('Please select an option');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .select('label bar')
      .in(selector);

    // Then
    const value = await p.getValueOf('#select');
    expect(value).toBe('bar');
  });
});
