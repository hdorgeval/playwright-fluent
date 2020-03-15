import * as SUT from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - isVisible', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should return false on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('foo').withText('bar');
    const result = await selector.isVisible();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const result = await selector.isVisible();

    // Then
    expect(result).toBe(true);
  });

  test('should return false when selector is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am hidden');

    const result = await selector.isVisible();

    // Then
    expect(result).toBe(false);
  });
  test('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am transparent');

    const result = await selector.isVisible();

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am out of screen');

    const result = await selector.isVisible();

    // Then
    expect(result).toBe(false);
  });
  test('should return true when selector is first hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
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

    const initialVisibleStatus = await selector.isVisible();
    await p.waitUntil(() => selector.isVisible());
    const finalVisibleStatus = await selector.isVisible();

    // Then
    expect(initialVisibleStatus).toBe(false);
    expect(finalVisibleStatus).toBe(true);
  });

  test('should wait for selector to be visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    const selector = p.selector('p').withText('I am dynamically added');
    const initialVisibleStatus = await selector.isVisible();

    // When
    await p.waitUntil(() => selector.isVisible());
    const finalVisibleStatus = await selector.isVisible();

    // Then
    expect(initialVisibleStatus).toBe(false);
    expect(finalVisibleStatus).toBe(true);
  });

  test('should return true, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'is-visible.test.html')}`;
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const result = await selector.isVisible();

    // Then
    expect(result).toBe(true);
  });
});
