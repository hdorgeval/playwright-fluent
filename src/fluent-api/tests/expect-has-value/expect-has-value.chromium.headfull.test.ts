import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - expect has value', (): void => {
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
  test('should wait until selector has expected value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-value.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .hasValue('hovered');

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('I am hovered');
  });

  test('should wait until selector object has expected value - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-value.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');
    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasValue('dynamically added');

    // Then
    const currentValue = await selector.value();
    expect(currentValue).toBe('dynamically added input');
  });

  test('should throw on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-value.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasValue('yo', { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should throw on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-value.test.html')}`;
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasValue('yo', { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should throw when selector does not contain value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-value.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasValue('yo', { verbose: true, timeoutInMilliseconds: 4000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Value of selector '#dynamically-added-input' does not contain 'yo', but instead it contains 'dynamically added input'",
    );
  });

  test('should throw when selector object does not contain value - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-value.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasValue('yo', { timeoutInMilliseconds: 4000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      `Value of 'selector(input)
  .withValue(dynamically added)' does not contain 'yo', but instead it contains 'dynamically added input'`,
    );
  });
});
