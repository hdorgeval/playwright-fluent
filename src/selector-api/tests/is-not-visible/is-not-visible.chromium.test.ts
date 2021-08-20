import * as SUT from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - isNotVisible', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return true on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor().navigateTo(url);

    // When
    const selector = p.selector('foo').withText('bar');
    const result = await selector.isNotVisible();

    // Then
    expect(result).toBe(true);
  });

  test('should return false when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
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

    const result = await selector.isNotVisible();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
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

    const result = await selector.isNotVisible();

    // Then
    expect(result).toBe(true);
  });
  test('should return true when selector is transparent', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
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

    const result = await selector.isNotVisible();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is out of screen', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
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

    const result = await selector.isNotVisible();

    // Then
    expect(result).toBe(true);
  });
  test('should return false when selector is first hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
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

    const initialVisibleStatus = await selector.isNotVisible();
    await p.wait(5000);
    const finalVisibleStatus = await selector.isNotVisible();

    // Then
    expect(initialVisibleStatus).toBe(true);
    expect(finalVisibleStatus).toBe(false);
  });

  test('should wait for selector to be visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('p').withText('I am dynamically added');

    const initialVisibleStatus = await selector.isNotVisible();
    // await p.waitUntil(() => selector.isNotVisible(), { verbose: true });
    await p.wait(6000);
    const finalVisibleStatus = await selector.isNotVisible();

    // Then
    expect(initialVisibleStatus).toBe(true);
    expect(finalVisibleStatus).toBe(false);
  });

  test('should return false, even when selector is created before page is instanciated', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'is-not-visible.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const result = await selector.isNotVisible();

    // Then
    expect(result).toBe(false);
  });
});
