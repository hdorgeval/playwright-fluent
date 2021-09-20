import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - expect has placeholder', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
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
        .hasPlaceholder('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should throw on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
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
        .hasPlaceholder('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should throw when selector has no placeholder - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
    const selector = '#input-with-no-placeholder';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasPlaceholder('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#input-with-no-placeholder' does not have placeholder 'yo', because no placeholder has been found on the selector",
    );
  });

  test('should throw when selector object has no placeholder - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
    const selector = p.selector('input').withValue('input with no placeholder');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasPlaceholder('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `'selector(input)
  .withValue(input with no placeholder)' does not have placeholder 'yo', because no placeholder has been found on the selector`,
    );
  });

  test('should throw when selector does not have the placeholder - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
    const selector = '#input-with-placeholder';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasPlaceholder('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#input-with-placeholder' does not have placeholder 'yo', but instead has placeholder 'enter text here'",
    );
  });

  test('should throw when selector object does have the placeholder - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
    const selector = p.selector('input').withValue('input with placeholder');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasPlaceholder('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `'selector(input)
  .withValue(input with placeholder)' does not have placeholder 'yo', but instead has placeholder 'enter text here'`,
    );
  });

  test('should wait until selector has expected placeholder - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .hasPlaceholder('foobar');

    // THEN
  });

  test('should wait until selector object has expected placeholder - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-placeholder.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added input');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .hasPlaceholder('foobar');

    // THEN
    const placeholder = await selector.placeholder();
    expect(placeholder).toBe('foobar');
  });
});
