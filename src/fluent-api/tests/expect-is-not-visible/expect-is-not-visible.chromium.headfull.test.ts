import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Fluent - expectThat isNotVisible', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
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
        .isNotVisible({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector '#visible' is visible.");
  });

  test('should give back an error when selector object is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
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
        .isNotVisible({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
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
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisible();

    // Then
    const isNotVisible = await p.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector object is hidden - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = p.selector('p').withText('I am visible then hidden');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisible();

    // Then
    const isNotVisible = await p.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector is removed - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = '#visible-then-removed';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisible();

    // Then
    const isNotVisible = await p.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should wait until selector object is removed - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = p.selector('p').withText('I am visible then removed from DOM');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isNotVisible();

    // Then
    const isNotVisible = await p.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(true);
  });

  test('should give back an error when selector is visible but out of viewport - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-not-visible.test.html')}`;
    const selector = p.selector('p').withText('I am out of viewport');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .isNotVisible({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(`Selector 'selector(p)
  .withText(I am out of viewport)' is visible.`);

    const isNotVisible = await p.isNotVisible(selector, noWaitNoThrowOptions);
    expect(isNotVisible).toBe(false);

    const isVisible = await p.isVisible(selector, noWaitNoThrowOptions);
    expect(isVisible).toBe(true);
  });
});
