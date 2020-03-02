import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Controller - expectThat isNotVisible', (): void => {
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

  test('should give back an error when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = '#visible';
    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .isNotVisible({ timeoutInMilliseconds: 2000, verbose: true });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector '#visible' is visible.");
  });

  test('should give back an error when selector object is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = pwc
      .selector('p')
      .withText('I am visible')
      .nth(1);

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .isNotVisible({ timeoutInMilliseconds: 2000, verbose: true });
    } catch (error) {
      result = error;
    }

    // Then
    const errorMessage = `Selector 'selector(p)
  .withText(I am visible)
  .nth(1)' is visible.`;
    expect(result && result.message).toContain(errorMessage);
  });
  test('should wait until selector is hidden - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = '#visible-then-hidden';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible();

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });
  test('should wait until selector is hidden (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = '#visible-then-hidden';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible({ verbose: true });

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });
  test('should wait until selector object is hidden - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = pwc.selector('p').withText('I am visible then hidden');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible();

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector object is hidden (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = pwc.selector('p').withText('I am visible then hidden');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible({ verbose: true });

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector is removed (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = '#visible-then-removed';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible({ verbose: true });

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector object is removed (verbose mode) - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = pwc.selector('p').withText('I am visible then removed from DOM');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible({ verbose: true });

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should assert is not visible when selector is out of viewport - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = pwc.selector('p').withText('I am out of viewport');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .isNotVisible({ verbose: true });

    // Then
    const isNotVisible = await pwc.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });
});
