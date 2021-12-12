import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Fluent - expectThat isNotVisibleInViewport()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when selector is visible in the current viewport', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    const selector = '#visible';
    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .isNotVisibleInViewport({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector '#visible' is visible in the current viewport.",
    );
  });

  test('should give back an error when selector object is visible in the current viewport', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    const selector = p
      .selector('p')
      .withText('I am visible')
      .nth(1);

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .isNotVisibleInViewport({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    const errorMessage = `Selector 'selector(p)
  .withText(I am visible)
  .nth(1)' is visible in the current viewport.`;
    expect(result && result.message).toContain(errorMessage);
  });
  test('should wait until selector is hidden - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    const selector = '#visible-then-hidden';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisibleInViewport();

    // Then
    const isNotVisible = await p.isNotVisibleInViewport(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector object is hidden - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    const selector = p.selector('p').withText('I am visible then hidden');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisibleInViewport();

    // Then
    const isNotVisible = await p.isNotVisibleInViewport(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector is removed - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    const selector = '#visible-then-removed';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisibleInViewport();

    // Then
    const isNotVisible = await p.isNotVisibleInViewport(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector object is removed - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    const selector = p.selector('p').withText('I am visible then removed from DOM');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisibleInViewport();

    // Then
    const isNotVisible = await p.isNotVisibleInViewport(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should check that selector is visible but out of viewport - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible-in-viewport.test.html')}`;
    const selector = p.selector('p').withText('I am out of viewport');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisibleInViewport()
      .expectThatSelector(selector)
      .isVisible();

    // Then
    const isNotVisibleInViewport = await p.isNotVisibleInViewport(selector, noWaitNoThrowOptions);
    expect(isNotVisibleInViewport).toBe(true);

    const isVisibleInViewport = await p.isVisibleInViewport(selector, noWaitNoThrowOptions);
    expect(isVisibleInViewport).toBe(false);

    const isNotVisible = await p.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(false);
  });
});
