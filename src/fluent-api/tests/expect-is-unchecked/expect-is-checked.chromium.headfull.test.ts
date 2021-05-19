import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Fluent - expectThat isUnchecked', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(120000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when selector does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-unchecked.test.html')}`;
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
        .isUnchecked({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should give back an error when selector object does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-unchecked.test.html')}`;
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
        .isUnchecked({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });
  test('should wait until selector exists and is unchecked - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-unchecked.test.html')}`;
    const selector = '#dynamically-added-checkbox';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isUnchecked();

    // Then
    const isUnchecked = await p.isUnchecked(selector, noWaitNoThrowOptions);
    expect(isUnchecked).toBe(true);
  });

  test('should wait until selector object exists and is unchecked - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-unchecked.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isUnchecked();

    // Then
    const isUnchecked = await selector.isUnchecked();
    expect(isUnchecked).toBe(true);
  });
});
