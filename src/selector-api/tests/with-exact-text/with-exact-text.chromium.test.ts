import * as path from 'path';
import { PlaywrightFluent } from '../../../fluent-api';

describe('Selector API - withExactText', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'with-exact-text.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selector = p.selector('[role="row"]').find('foobar').withExactText('yo');
    const handles = await selector.getAllHandles();
    const firstHandle = await selector.getHandle();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
    expect(firstHandle).toBeNull();
  });

  test('should get handles', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'with-exact-text.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('td')
      .withExactText('cell');
    const handles = await selector.getAllHandles();
    const firstHandle = await selector.getHandle();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(2);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toBe('cell');

    expect(await firstHandle!.evaluate((node) => (node as HTMLSelectElement).innerText)).toBe(
      'cell',
    );
    expect(await handles[1].evaluate((node) => (node as HTMLSelectElement).innerText)).toBe('cell');

    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .withExactText(cell)`);
  });

  test('should get handles, even when selector is created before browser is launched', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p.selector('[role="row"]')
      .find('td')
      .withExactText('cell');

    const url = `file:${path.join(__dirname, 'with-exact-text.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url)
      .expectThat(selector)
      .exists();

    // When
    const handles = await selector.getAllHandles();
    const firstHandle = await selector.getHandle();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(2);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).innerText)).toBe('cell');

    expect(await firstHandle!.evaluate((node) => (node as HTMLSelectElement).innerText)).toBe(
      'cell',
    );
    expect(await handles[1].evaluate((node) => (node as HTMLSelectElement).innerText)).toBe('cell');

    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .withExactText(cell)`);
  });
});
