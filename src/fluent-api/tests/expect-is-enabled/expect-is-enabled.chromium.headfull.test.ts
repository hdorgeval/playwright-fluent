import * as path from 'path';
import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
describe('Playwright Fluent - expectThat isEnabled', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when selector does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
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
        .isEnabled({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should give back an error when selector object does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
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
        .isEnabled({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });
  test('should wait until selector exists and is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isEnabled();

    // Then
    const isEnabled = await p.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });

  test('should wait until selector object exists and is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-enabled.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isEnabled();

    // Then
    const isEnabled = await p.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });
});
