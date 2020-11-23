import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - getAllHandles', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should throw an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      const selector = p.selector('foobar');
      await selector.getAllHandles();
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot query selector 'foobar' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'get-all-handles.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selector = p.selector('foobar');
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get handles', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'get-all-handles.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selector = p.selector('[role="row"]');
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(3);

    expect(await handles[0].evaluate((node) => (node as HTMLElement).innerText)).toContain('row1');
    expect(await handles[1].evaluate((node) => (node as HTMLElement).innerText)).toContain('row2');
    expect(await handles[2].evaluate((node) => (node as HTMLElement).innerText)).toContain('row3');
    expect(selector.toString()).toBe('selector([role="row"])');
  });

  test('should get handles, even when selector is created before browser is launched', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'get-all-handles.test.html')}`;
    const selector = p.selector('[role="row"]');
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(3);

    expect(await handles[0].evaluate((node) => (node as HTMLElement).innerText)).toContain('row1');
    expect(await handles[1].evaluate((node) => (node as HTMLElement).innerText)).toContain('row2');
    expect(await handles[2].evaluate((node) => (node as HTMLElement).innerText)).toContain('row3');
    expect(selector.toString()).toBe('selector([role="row"])');
  });
});
