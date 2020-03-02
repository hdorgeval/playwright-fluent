import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - parent', (): void => {
  let pwc: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'parent.test.html')}`;
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = pwc
      .selector('[role="row"]')
      .withText('foobar')
      .parent();
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get parent handle', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'parent.test.html')}`;
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const selector = pwc
      .selector('[role="row"]')
      .find('td')
      .withText('row2')
      .parent();

    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('TR');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .withText(row2)
  .parent()`);
  });

  test('should get handles, even when selector is created before page is instanciated', async (): Promise<
    void
  > => {
    // Given
    const selector = pwc
      .selector('[role="row"]')
      .find('td')
      .withText('row2')
      .parent();

    const url = `file:${path.join(__dirname, 'parent.test.html')}`;
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(1);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('TR');
    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .withText(row2)
  .parent()`);
  });
});
