import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - double-click', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait until selector is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .doubleClick(selector);

    // Then
    const selectedText = await p.getSelectedText();
    expect(selectedText).toBe('dynamically');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(true);
  });

  test('should wait until selector object is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = p.selector('input').withValue('dynamically');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .doubleClick(selector);

    // Then
    const selectedText = await p.getSelectedText();
    expect(selectedText).toBe('dynamically');
    const hasFocus = await p.hasFocus(selector);
    expect(hasFocus).toBe(true);
  });
  test('should not double-click on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .doubleClick(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM");
  });

  test('should not double-click on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .doubleClick(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot double-click on 'selector(foobar)' because this selector was not found in DOM",
    );
  });
  test('should not double-click on a hidden selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = '#hidden';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .doubleClick(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot hover on '#hidden' because this selector is not visible",
    );
  });

  test('should not double-click on a disabled selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = '#disabled';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .doubleClick(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot double-click on '#disabled' because this selector is disabled",
    );
  });

  test('should not double-click on a disabled selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = p.selector('input').withValue('I am disabled');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .doubleClick(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const errorMessage = `Cannot double-click on 'selector(input)
  .withValue(I am disabled)' because this selector is disabled`;
    expect(result && result.message).toContain(errorMessage);
  });

  test('should double-click - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'double-click.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .doubleClick(selector)
      .expectThatAsyncFunc(async () => await p.getSelectedText())
      .resolvesTo('dynamically');
  });

  test('should double-click on a label - chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    const label = p.selector('label').withText('Email');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .doubleClick(label)
      .expectThatAsyncFunc(async () => await p.getSelectedText())
      .resolvesTo('Email');
  });
});
