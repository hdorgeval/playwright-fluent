import * as SUT from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - isNotVisibleInViewport', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return true on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor().navigateTo(url);

    // When
    const selector = p.selector('foo').withText('bar');
    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(true);
  });

  test('should return false when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is visible but out of viewport', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('p').withText('I am out of viewport');

    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am hidden');

    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(true);
  });
  test('should return true when selector is transparent', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is out of screen', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(true);
  });
  test('should return true when selector is first hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p
      .selector('[role="row"]')
      .find('td')
      .withText('hidden, then visible')
      .find('p'); //only the <p> ... </p> element is hidden first

    const initialVisibleStatus = await selector.isNotVisibleInViewport();
    await p.wait(5000);
    const finalVisibleStatus = await selector.isNotVisibleInViewport();

    // Then
    expect(initialVisibleStatus).toBe(true);
    expect(finalVisibleStatus).toBe(false);
  });

  test('should use some waiting mechanism to wait for selector to be not visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('p').withText('visible, then hidden');

    const initialVisibleStatus = await selector.isNotVisibleInViewport();
    await p.waitUntil(() => selector.isNotVisibleInViewport(), { verbose: true });
    const finalVisibleStatus = await selector.isNotVisibleInViewport();

    // Then
    expect(initialVisibleStatus).toBe(false);
    expect(finalVisibleStatus).toBe(true);
  });

  test('should return false when selector is visible but the selector-fluent is created before page is instanciated', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'is-not-visible-in-viewport.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const result = await selector.isNotVisibleInViewport();

    // Then
    expect(result).toBe(false);
  });
});
