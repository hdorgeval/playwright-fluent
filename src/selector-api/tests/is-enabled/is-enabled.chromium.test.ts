import * as path from 'path';
import * as SUT from '../../../fluent-api';

describe('Selector API - isEnabled', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return false on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-enabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('input').withValue('foo');
    const result = await selector.isEnabled();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is enabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-enabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('input').withValue('I am enabled');

    const result = await selector.isEnabled();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is enabled #2', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-enabled.test.html')}`;

    // create selector before browser is launched
    const selector = p.selector('input').withValue('I am enabled');

    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const result = await selector.isEnabled();

    // Then
    expect(result).toBe(true);
  });
  test('should return false when selector is disabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-enabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('input').withValue('I am disabled');

    const result = await selector.isEnabled();

    // Then
    expect(result).toBe(false);
  });

  test('should wait for selector to be enabled', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-enabled.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    const selector = p.selector('input#disabled-then-enabled-input');
    const initialEnabledStatus = await selector.isEnabled();

    // When
    await p.waitUntil(() => selector.isEnabled());
    const finalEnabledStatus = await selector.isEnabled();

    // Then
    expect(initialEnabledStatus).toBe(false);
    expect(finalEnabledStatus).toBe(true);
  });
});
