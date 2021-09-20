import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Fluent - expectThat does not exist', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when selector is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-exist.test.html')}`;
    const selector = '#hidden';
    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .doesNotExist({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector '#hidden' was still found in DOM.");
  });

  test('should give back an error when selector object is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-exist.test.html')}`;
    const selector = p.selector('#hidden');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .doesNotExist({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Selector 'selector(#hidden)' was still found in DOM.",
    );
  });
  test('should wait until selector is removed from dom - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-exist.test.html')}`;
    const selector = '#visible-then-removed';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThat(selector)
      .doesNotExist();

    // Then
    const exists = await p.doesNotExist(selector, noWaitNoThrowOptions);
    expect(exists).toBe(true);
  });

  test('should wait until selector object is removed from dom - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-does-not-exist.test.html')}`;
    const selector = p.selector('#visible-then-removed');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .doesNotExist();

    // Then
    const exists = await p.doesNotExist(selector, noWaitNoThrowOptions);
    expect(exists).toBe(true);
  });
});
