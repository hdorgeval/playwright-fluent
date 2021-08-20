import * as SUT from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - isDisabled', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return false on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('input').withValue('foo');
    const result = await selector.isDisabled();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is disabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('input').withValue('I am disabled');

    const result = await selector.isDisabled();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is disabled #2', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;

    // create selector before browser is launched
    const selector = p.selector('input').withValue('I am disabled');

    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const result = await selector.isDisabled();

    // Then
    expect(result).toBe(true);
  });
  test('should return false when selector is enabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('input').withValue('I am enabled');

    const result = await selector.isDisabled();

    // Then
    expect(result).toBe(false);
  });

  test('should wait for selector to be disabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-disabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    const selector = p.selector('input#enabled-then-disabled-input');
    const initialDisabledStatus = await selector.isDisabled();

    // When
    await p.waitUntil(() => selector.isDisabled());
    const finalDisabledStatus = await selector.isDisabled();

    // Then
    expect(initialDisabledStatus).toBe(false);
    expect(finalDisabledStatus).toBe(true);
  });
});
