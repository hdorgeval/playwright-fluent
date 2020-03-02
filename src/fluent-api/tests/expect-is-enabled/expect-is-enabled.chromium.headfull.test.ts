import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Controller - expectThat isEnabled', (): void => {
  let pwc: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should give back an error when selector does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
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
        .isEnabled({ timeoutInMilliseconds: 2000, verbose: true });
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
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
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
        .isEnabled({ timeoutInMilliseconds: 2000, verbose: true });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });
  test('should wait until selector exists and is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled();

    // Then
    const isEnabled = await pwc.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });
  test('should wait until selector exists and is enabled (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled({ verbose: true });

    // Then
    const isEnabled = await pwc.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });
  test('should wait until selector object exists and is enabled - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
    const selector = pwc.selector('input').withValue('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled();

    // Then
    const isEnabled = await pwc.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });

  test('should wait until selector object exists and is enabled (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
    const selector = pwc.selector('input').withValue('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isEnabled({ verbose: true });

    // Then
    const isEnabled = await pwc.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });
});
