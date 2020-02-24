import * as SUT from '../../controller';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Controller - expectThat hasFocus', (): void => {
  let pwc: SUT.PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new SUT.PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should give back an error when selector does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = 'foobar';
    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .hasFocus({ timeoutInMilliseconds: 2000, verbose: true });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should give back an error when selector object does not exists', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = pwc.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .hasFocus({ timeoutInMilliseconds: 2000, verbose: true });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });
  test('should wait until selector exists and has focus - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .hasFocus();

    // Then
    const hasFocus = await pwc.hasFocus(selector, noWaitNoThrowOptions);
    expect(hasFocus).toBe(true);
  });
  test('should wait until selector exists and has focus (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .hasFocus({ verbose: true });

    // Then
    const hasFocus = await pwc.hasFocus(selector, noWaitNoThrowOptions);
    expect(hasFocus).toBe(true);
  });
  test('should wait until selector object exists and has focus - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = pwc.selector('input').withValue('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .hasFocus();

    // Then
    const hasFocus = await pwc.hasFocus(selector, noWaitNoThrowOptions);
    expect(hasFocus).toBe(true);
  });

  test('should wait until selector object exists and has focus (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = pwc.selector('input').withValue('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .hasFocus({ verbose: true });

    // Then
    const hasFocus = await pwc.hasFocus(selector, noWaitNoThrowOptions);
    expect(hasFocus).toBe(true);
  });
  test('should give back an error when selector does not have focus - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = '#input1';

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .hasFocus({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const hasFocus = await pwc.hasFocus(selector, noWaitNoThrowOptions);
    expect(hasFocus).toBe(false);
    expect(result && result.message).toContain("Selector '#input1' does not have the focus.");
  });

  test('should give back an error when selector object does not have focus - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-has-focus.test.html')}`;
    const selector = pwc.selector('input').withValue('1');

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .hasFocus({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const hasFocus = await pwc.hasFocus(selector, noWaitNoThrowOptions);
    expect(hasFocus).toBe(false);
    const expectedMessage = `selector(input)
  .withValue(1)' does not have the focus.`;
    expect(result && result.message).toContain(expectedMessage);
  });
});