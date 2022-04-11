import * as path from 'path';
import * as SUT from '../../../fluent-api';

describe('Selector API - exists', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return false on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('foo').withText('bar');
    const result = await selector.exists();

    // Then
    expect(result).toBe(false);
  });

  test('should return true when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
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

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
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

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });
  test('should return true when selector is transparent', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
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

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });

  test('should return true when selector is out of screen', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
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

    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });
  test('should return true when selector is first hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
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

    const initialExistsStatus = await selector.exists();
    await p.wait(5000);
    const finalExistsStatus = await selector.exists();

    // Then
    expect(initialExistsStatus).toBe(true);
    expect(finalExistsStatus).toBe(true);
  });

  test('should wait for selector to exists', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor().navigateTo(url);

    // When
    const selector = p.selector('p').withText('I am dynamically added');

    const initialExistsStatus = await selector.exists();
    // await p.waitUntil(() => selector.exists(), { verbose: true });
    await p.wait(6000);
    const finalExistsStatus = await selector.exists();

    // Then
    expect(initialExistsStatus).toBe(false);
    expect(finalExistsStatus).toBe(true);
  });

  test('should return true, even when selector is created before page is instanciated', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('p')
      .withText('I am visible');

    const url = `file:${path.join(__dirname, 'exists.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const result = await selector.exists();

    // Then
    expect(result).toBe(true);
  });
});
