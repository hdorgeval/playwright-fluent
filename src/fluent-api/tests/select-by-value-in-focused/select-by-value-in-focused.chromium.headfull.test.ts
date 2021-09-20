import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - selectByValue(value).inFocused()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should first give focus on a select element', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in-focused.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .selectByValue('value 2')
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
    const url = `file:${path.join(__dirname, 'select-by-value-in-focused.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(p.selector('label').withText('First Field'))
      .selectByValue('value 2 #select')
      .inFocused();

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value 2 #select');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(true);

    const selectedOption = await p.getSelectedOptionOf(selector);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.label).toBe('label 2');
  });

  test('should wait until option is available - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in-focused.test.html')}`;
    const selector = '#select';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(p.selector('label').withText('First Field'))
      .selectByValue('value bar')
      .inFocused();

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value bar');

    const selectedOption = await p.getSelectedOptionOf(selector);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.label).toBe('label bar');
  });

  test('should wait until options are available - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'select-by-value-in-focused.test.html')}`;
    const selector = '#multiSelect';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(p.selector('label').withText('Multiselect Field'))
      .selectByValue('value foo', 'value bar')
      .inFocused();

    // Then
    const value = await p.getValueOf(selector);
    expect(value).toBe('value foo');

    const selectedOptions = await p.getAllSelectedOptionsOf(selector);
    expect(Array.isArray(selectedOptions)).toBe(true);
    expect(selectedOptions.length).toBe(2);
    expect(selectedOptions[0].label).toBe('label foo');
    expect(selectedOptions[1].label).toBe('label bar');
  });
});
