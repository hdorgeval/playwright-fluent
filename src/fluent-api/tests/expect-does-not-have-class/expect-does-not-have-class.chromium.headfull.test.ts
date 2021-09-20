import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - expect does not have class', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
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
        .doesNotHaveClass('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should throw on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
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
        .doesNotHaveClass('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should throw when selector has class - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
    const selector = '#input-with-class-foo-and-bar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .doesNotHaveClass('foo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#input-with-class-foo-and-bar' has classes 'foo,bar', but it should not have class 'foo'",
    );
  });

  test('should throw when selector object has class - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
    const selector = p.selector('input').withValue('input with class foo and bar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .doesNotHaveClass('foo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `'selector(input)
  .withValue(input with class foo and bar)' has classes 'foo,bar', but it should not have class 'foo'`,
    );
  });

  test('should wait then throw when selector has class - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
    const selector = '#dynamically-added-input-with-class-foo-and-bar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .doesNotHaveClass('foo', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#dynamically-added-input-with-class-foo-and-bar' has classes 'foo,bar,baz', but it should not have class 'foo'",
    );
  });

  test('should wait then throw when selector object has class - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
    const selector = p
      .selector('input')
      .withValue('dynamically added input with class foo and bar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .doesNotHaveClass('foo', { timeoutInMilliseconds: 5000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `'selector(input)
  .withValue(dynamically added input with class foo and bar)' has classes 'foo,bar,baz', but it should not have class 'foo'`,
    );
  });

  test('should wait until selector does not have expected class - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
    const selector = '#dynamically-added-input-with-class-foo-and-bar';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .doesNotHaveClass('baz');

    // THEN
  });

  test('should wait until selector object does not have expected class - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-have-class.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added input');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .doesNotHaveClass('baz');

    // Then
    const hasNotClass = await selector.doesNotHaveClass('baz');
    expect(hasNotClass).toBe(true);
  });
});
