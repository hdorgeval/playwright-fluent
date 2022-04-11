import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - expect has attribute with value', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
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
        .hasAttributeWithValue('data-id', 'yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should throw on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
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
        .hasAttributeWithValue('data-id', 'yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should throw when selector has not the attribute - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
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
        .hasAttributeWithValue('data-id', 'yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#input-with-no-placeholder' does not have attribute 'data-id' with value 'yo', because no attribute with this name has been found on the selector",
    );
  });

  test('should throw when selector object has not the attribute - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
    const selector = p.selector('input').withValue('input with no data-id');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasAttributeWithValue('data-id', 'yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `'selector(input)
  .withValue(input with no data-id)' does not have attribute 'data-id' with value 'yo', because no attribute with this name has been found on the selector`,
    );
  });

  test('should throw when selector does not have the attribute with the expected value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
    const selector = '#input-with-data-id';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasAttributeWithValue('data-id', 'foobar', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#input-with-data-id' does not have attribute 'data-id' with value 'foobar', but instead the attribute value is 'yo'",
    );
  });

  test('should throw when selector object does have the attribute with the expected value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
    const selector = p.selector('input').withValue('input with data-id');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasAttributeWithValue('data-id', 'foobar', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `'selector(input)
  .withValue(input with data-id)' does not have attribute 'data-id' with value 'foobar', but instead the attribute value is 'yo'`,
    );
  });

  test('should wait until selector has expected attribute - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .hasAttributeWithValue('data-id', 'foobar');

    // THEN
  });

  test('should wait until selector object has expected attribute - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-attribute-with-value.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added input');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .hover(selector)
      .expectThatSelector(selector)
      .hasAttributeWithValue('data-id', 'foobar');

    // THEN
    const attributeValue = await selector.getAttribute('data-id');
    const hasAttributeValue = await selector.hasAttributeWithValue('data-id', 'foobar');
    expect(attributeValue).toBe('foobar');
    expect(hasAttributeValue).toBe(true);
  });
});
