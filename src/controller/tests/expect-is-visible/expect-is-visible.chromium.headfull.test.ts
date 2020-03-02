import * as SUT from '../../controller';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Controller - expectThat isVisible', (): void => {
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
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
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
        .isVisible({ timeoutInMilliseconds: 2000, verbose: true });
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
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
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
        .isVisible({ timeoutInMilliseconds: 2000, verbose: true });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });
  test('should wait until selector exists and is visible - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
    const selector = '#dynamically-added-paragraph';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isVisible();

    // Then
    const isVisible = await pwc.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(true);
  });
  test('should wait until selector exists and is visible (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
    const selector = '#dynamically-added-paragraph';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isVisible({ verbose: true });

    // Then
    const isVisible = await pwc.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(true);
  });
  test('should wait until selector object exists and is visible - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
    const selector = pwc.selector('p').withText('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isVisible();

    // Then
    const isVisible = await pwc.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(true);
  });

  test('should wait until selector object exists and is visible (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
    const selector = pwc.selector('p').withText('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isVisible({ verbose: true });

    // Then
    const isVisible = await pwc.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(true);
  });
  test('should give back an error when selector is hidden - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
    const selector = '#hidden';

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .isVisible({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const isVisible = await pwc.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(false);
    expect(result && result.message).toContain("Selector '#hidden' is not visible.");
  });

  test('should give back an error when selector object is not visible - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-visible.test.html')}`;
    const selector = pwc.selector('p').withText('I am hidden');

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .isVisible({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const isVisible = await pwc.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(false);
    const expectedMessage = `selector(p)
  .withText(I am hidden)' is not visible.`;
    expect(result && result.message).toContain(expectedMessage);
  });
});
