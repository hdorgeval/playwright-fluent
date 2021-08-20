import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - previous sibling', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should get no handle on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'previous-sibling.test.html')}`;
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
      .withText('foo and bar and baz')
      .previousSibling();
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(0);
  });

  test('should get previous sibling handle', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'previous-sibling.test.html')}`;
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
      .find('select[data-test-id="my-select2"]')
      .find('option')
      .previousSibling();

    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(2);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('OPTION');
    expect(await handles[0].evaluate((node) => (node as HTMLElement).innerText)).toBe(
      'Select 2 - label 1',
    );

    expect(await handles[1].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('OPTION');
    expect(await handles[1].evaluate((node) => (node as HTMLElement).innerText)).toBe(
      'Select 2 - label 2',
    );

    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select2"])
  .find(option)
  .previousSibling()`);
  });

  test('should get handles, even when selector is created before page is instanciated', async (): Promise<void> => {
    // Given
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('select[data-test-id="my-select2"]')
      .find('option')
      .previousSibling();

    const url = `file:${path.join(__dirname, 'previous-sibling.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url);

    // When
    const handles = await selector.getAllHandles();

    // Then
    expect(Array.isArray(handles)).toBe(true);
    expect(handles.length).toBe(2);
    expect(await handles[0].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('OPTION');
    expect(await handles[0].evaluate((node) => (node as HTMLElement).innerText)).toBe(
      'Select 2 - label 1',
    );

    expect(await handles[1].evaluate((node) => (node as HTMLSelectElement).tagName)).toBe('OPTION');
    expect(await handles[1].evaluate((node) => (node as HTMLElement).innerText)).toBe(
      'Select 2 - label 2',
    );

    expect(selector.toString()).toBe(`selector([role="row"])
  .find(select[data-test-id="my-select2"])
  .find(option)
  .previousSibling()`);
  });

  test('should select sibling option', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'previous-sibling.test.html')}`;
    const select = 'select[data-test-id="my-select1"]';
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .navigateTo(url)
      .hover(select);

    // prettier-ignore
    const lastOption = p
      .selector('[role="row"]')
      .find(select)
      .find('option')
      .nth(-1);

    // When
    const previousOption = (await lastOption.previousSibling().innerText()) || 'unknown';
    await p.select(previousOption).in(select);

    // Then
    const selectedOption = await p.getSelectedOptionOf(select);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(selectedOption!.label).toBe('Select 1 - label 2');
  });
});
