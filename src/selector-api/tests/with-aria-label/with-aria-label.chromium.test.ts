import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - withAriaLabel', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'with-aria-label.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selector = p.selector('[role="row"]').find('foobar').withAriaLabel('yo');
    const handles = await selector.getAllHandles();
    const firstHandle = await selector.getHandle();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
    expect(firstHandle).toBeNull();
  });

  test('should get handles', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'with-aria-label.test.html')}`;
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
      .find('input')
      .withAriaLabel('foo bar');
    const handles = await selector.getAllHandles();
    const firstHandle = await selector.getHandle();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(2);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await firstHandle!.evaluate((node) => (node as HTMLSelectElement).value)).toBe('');
    expect(await handles[1].evaluate((node) => (node as HTMLSelectElement).value)).toBe('foobar');

    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .find(input)
  .withAriaLabel(foo bar)`);
  });

  test('should get handles, even when selector is created before browser is launched', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p.selector('[role="row"]')
      .find('td')
      .find('input')
      .withAriaLabel('foo bar');

    const url = `file:${path.join(__dirname, 'with-aria-label.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url)
      .click(selector)
      .typeText('yo');

    // When
    const handles = await selector.getAllHandles();
    const firstHandle = await selector.getHandle();

    // Then
    await p.expectThat(selector).hasValue('yo');

    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(2);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).value)).toBe('yo');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await firstHandle!.evaluate((node) => (node as HTMLSelectElement).value)).toBe('yo');
    expect(await handles[1].evaluate((node) => (node as HTMLSelectElement).value)).toBe('foobar');

    expect(selector.toString()).toBe(`selector([role="row"])
  .find(td)
  .find(input)
  .withAriaLabel(foo bar)`);
  });
});