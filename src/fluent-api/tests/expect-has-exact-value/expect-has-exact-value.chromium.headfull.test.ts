import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - expect has exact value', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait until selector has expected exact value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-exact-value.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasExactValue('dynamically added input');

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('dynamically added input');
  });

  test('should wait until selector object has expected exact value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-exact-value.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');
    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasExactValue('dynamically added input');

    // Then
    const currentValue = await selector.value();
    expect(currentValue).toBe('dynamically added input');
  });

  test('should throw on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-exact-value.test.html')}`;
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
        .hasExactValue('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should throw on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-exact-value.test.html')}`;
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
        .hasExactValue('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should throw when selector does not contain value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-exact-value.test.html')}`;
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
        .hasExactValue('yo', { timeoutInMilliseconds: 4000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Value of selector '#dynamically-added-input' is not equal to 'yo', but instead is 'dynamically added input'",
    );
  });

  test('should throw when selector object does not contain value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-exact-value.test.html')}`;
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
        .hasExactValue('yo', { timeoutInMilliseconds: 4000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `Value of 'selector(input)
  .withValue(dynamically added)' is not equal to 'yo', but instead is 'dynamically added input'`,
    );
  });
});
