import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - nth', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw an error when index is 0', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selector = p.selector('[role="row"]').nth(0);
    let result: Error | undefined = undefined;
    try {
      await selector.getFirstHandleOrNull();
    } catch (error) {
      result = error as Error;
    }

    // Then
    const expectedErrorMessage = 'Index is one-based';
    expect(result && result.message).toContain(expectedErrorMessage);
  });
  test('should get no handle on too big index', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selector = p.selector('[role="row"]').nth(100);
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get first handle', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(1);
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('1');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(1)`);
  });

  test('should get last handle', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(-1);
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(-1)`);
  });

  test('should get the before the last handle', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(-2);
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('2');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(-2)`);
  });

  test('should get the third handle', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(3);
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(3)`);
  });

  test('should get handle, even when selector is created before page is instanciated', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('select[data-test-id="my-select"]')
      .nth(3);

    const url = `file:${path.join(__dirname, 'nth.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('3');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select"])
  .nth(3)`);
  });
});
