import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - select(label).inFocused()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should first give focus on a select element', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in-focused.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .select('label 2')
        .inFocused({ timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "The element that has the focus is 'BODY', but it should be a 'SELECT' element instead.",
    );
  });

  test('should select an existing option - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in-focused.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(p.selector('label').withText('First Field'))
      .select('label 2')
      .inFocused();

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value2');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(true);

    const allOptions = await p.getAllOptionsOf(selector);
    expect(Array.isArray(allOptions)).toBe(true);
    const selectedOption = allOptions.find((option) => option.selected);

    expect(selectedOption!.selected).toBe(true);

    expect(selectedOption!.label).toBe('label 2');
  });

  test('should wait until option is available - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in-focused.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(p.selector('label').withText('First Field'))
      .select('label bar')
      .inFocused();

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('bar');
  });

  test('should wait until options are available - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-in-focused.test.html')}`;
    const selector = '#multiSelect';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(p.selector('label').withText('Multiselect Field'))
      .select('label foo', 'label bar')
      .inFocused();

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('foo');

    const allOptions = await p.getAllOptionsOf(selector);
    expect(Array.isArray(allOptions)).toBe(true);
    const selectedOptions = allOptions.filter((option) => option.selected);
    expect(Array.isArray(selectedOptions)).toBe(true);
    expect(selectedOptions.length).toBe(2);
    expect(selectedOptions[0].label).toBe('label foo');
    expect(selectedOptions[1].label).toBe('label bar');
  });
});
