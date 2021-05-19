import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - expect has text', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait until selector exists - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
    const selector = '#dynamically-added-paragraph';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasText('I am dynamically added in DOM');

    // Then
    const innerText = await p.getInnerTextOf(selector);
    expect(innerText).toBe('I am dynamically added in DOM');
  });

  test('should wait until selector object exists - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
    const selector = p.selector('p').withText('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasText('I am dynamically added in DOM');

    // Then
    const innerText = await p.getInnerTextOf('#dynamically-added-paragraph');
    expect(innerText).toBe('I am dynamically added in DOM');
  });

  test('should throw on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
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
        .hasText('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should throw on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
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
        .hasText('yo', { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should throw when selector does not contain text - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
    const selector = '#dynamically-added-paragraph';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasText('yo', { timeoutInMilliseconds: 4000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Inner text of selector '#dynamically-added-paragraph' does not contain 'yo', but instead it contains 'I am dynamically added in DOM'",
    );
  });

  test('should throw when selector object does not contain text - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
    const selector = p.selector('p').withText('dynamically added');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .hasText('yo', { timeoutInMilliseconds: 4000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      `Inner text of 'selector(p)
  .withText(dynamically added)' does not contain 'yo', but instead it contains 'I am dynamically added in DOM'`,
    );
  });

  test('should replace char 160 by a true space - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
    const selector = '#dynamically-added-paragraph-with-160';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasText('12.34 %');

    // Then
    const innerText = await p.getInnerTextOf(selector);
    expect(innerText).toBe('12.34 %');
  });

  test('should replace char 160 by a true space #2 - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-text.test.html')}`;
    const selector = p.selector('p').withText('12.34 %');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .hasText('12.34 %');

    // Then
    const innerText = await p.getInnerTextOf('#dynamically-added-paragraph-with-160');
    expect(innerText).toBe('12.34 %');
  });
});
