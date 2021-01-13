import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - selectByValue(values).in(selector)', (): void => {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.selected).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.selected).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  test.only('should wait until option is available in selector object - chromium', async (): Promise<void> => {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.value).toBe('value bar');
  });
});
