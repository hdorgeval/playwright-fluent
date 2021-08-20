import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
import * as path from 'path';
describe('Playwright Fluent - expectThat isReadOnly', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when selector does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-read-only.test.html')}`;
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
        .isReadOnly({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM.");
  });

  test('should give back an error when selector object does not exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-read-only.test.html')}`;
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThat(selector)
        .isReadOnly({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'selector(foobar)' was not found in DOM.");
  });

  test('should wait until selector exists and is read-only - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-read-only.test.html')}`;
    const selector = '#dynamically-added-readonly-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isReadOnly();

    // Then
    const isReadonly = await p.isReadOnly(selector, noWaitNoThrowOptions);
    expect(isReadonly).toBe(true);
  });

  test('should wait until selector object exists and is read-only - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-read-only.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added readonly input');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isReadOnly();

    // Then
    const isDisabled = await p.isReadOnly(selector, noWaitNoThrowOptions);
    expect(isDisabled).toBe(true);
  });
  test('should give back an error when selector is only disabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-read-only.test.html')}`;
    const selector = '#disabled-input';
    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .isReadOnly({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector '#disabled-input' is not read-only.");
  });

  test('should give back an error when selector object is only disabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-is-read-only.test.html')}`;
    const selector = p.selector('input').withValue('I am disabled but not readonly');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatSelector(selector)
        .isReadOnly({ timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(`Selector 'selector(input)
  .withValue(I am disabled but not readonly)' is not read-only.`);
  });
});
