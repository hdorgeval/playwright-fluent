import * as SUT from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - doesNotExist', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should return true on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'doesNotExist.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = p.selector('foo').withText('bar');
    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(true);
  });

  test('should return false when selector is visible', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'doesNotExist.test.html')}`;
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

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is hidden', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'doesNotExist.test.html')}`;
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

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });
  test('should return false when selector is transparent', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'doesNotExist.test.html')}`;
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

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });

  test('should return false when selector is out of screen', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'doesNotExist.test.html')}`;
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

    const result = await selector.doesNotExist();

    // Then
    expect(result).toBe(false);
  });

  test('should wait for selector to be removed from DOM', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'doesNotExist.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor().navigateTo(url);

    // When
    const selector = p.selector('p').withText('I am visible and will be removed');
    const initialRemovedStatus = await selector.doesNotExist();
    await p.waitUntil(() => selector.doesNotExist());

    const finalRemovedStatus = await selector.doesNotExist();

    // Then
    expect(initialRemovedStatus).toBe(false);
    expect(finalRemovedStatus).toBe(true);
  });
});
