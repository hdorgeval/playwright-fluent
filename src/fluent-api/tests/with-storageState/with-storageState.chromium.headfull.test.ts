import { join } from 'path';
import { readFileSync } from 'fs';
import { PlaywrightFluent } from '../../playwright-fluent';
import { StorageState } from '../../playwright-types';
describe('Playwright Fluent - withStorageState', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should re-hydrate cookies and localStorage from a file - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const storageStateFile = join(__dirname, 'storage-state.json');
    const storyBookComponentsTree = p
      .selector('div#storybook-explorer-tree')
      .find('button')
      .withText('COMPONENTS');

    // When
    await p
      .withBrowser(browser)
      .withCursor()
      .withOptions({ headless: false })
      .withStorageState(storageStateFile)
      .navigateTo(url)
      .hover(storyBookComponentsTree);

    // Then the foo=bar cookie should be re-hydrated
    const currentStorageState = await p.currentStorageState();
    // await p.saveStorageStateTo(storageStateFile);
    expect(currentStorageState).toBeDefined();

    expect(currentStorageState!.cookies).toBeDefined();

    expect(currentStorageState!.cookies?.length).toBeGreaterThanOrEqual(1);

    const hasGeneratedExtraCookie = currentStorageState!.cookies!.some(
      (cookie) => cookie.name === 'foo' && cookie.value === 'bar',
    );
    expect(hasGeneratedExtraCookie).toBe(true);

    // And the localStorage foobar should be re-hydrated

    expect(currentStorageState!.origins).toBeDefined();

    const localStorageValues = currentStorageState!
      .origins!.filter((origin) => origin.origin === 'https://reactstrap.github.io')!
      .flatMap((origin) => origin.localStorage);

    const hasGeneratedExtraStorage = localStorageValues.some(
      (localStorage) =>
        localStorage.name === 'foo-localStorage' && localStorage.value === 'bar-localStorage',
    );

    expect(localStorageValues.length).toBeGreaterThan(1);
    expect(hasGeneratedExtraStorage).toBe(true);
  });

  test('should re-hydrate cookies and localStorage from an object - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const storageStateFile = join(__dirname, 'storage-state.json');
    const stringifiedStorageState = readFileSync(storageStateFile).toString();
    const storageState = JSON.parse(stringifiedStorageState) as StorageState;
    const storyBookComponentsTree = p
      .selector('div#storybook-explorer-tree')
      .find('button')
      .withText('COMPONENTS');

    // When
    await p
      .withBrowser(browser)
      .withCursor()
      .withOptions({ headless: false })
      .withStorageState(storageState)
      .navigateTo(url)
      .hover(storyBookComponentsTree);

    // Then the foo=bar cookie should be re-hydrated
    const currentStorageState = await p.currentStorageState();
    expect(currentStorageState).toBeDefined();

    expect(currentStorageState!.cookies).toBeDefined();

    expect(currentStorageState!.cookies?.length).toBeGreaterThanOrEqual(1);
    const hasGeneratedExtraCookie = currentStorageState!.cookies!.some(
      (cookie) => cookie.name === 'foo' && cookie.value === 'bar',
    );
    expect(hasGeneratedExtraCookie).toBe(true);

    // And the localStorage foobar should be re-hydrated

    expect(currentStorageState!.origins).toBeDefined();

    const localStorageValues = currentStorageState!
      .origins!.filter((origin) => origin.origin === 'https://reactstrap.github.io')!
      .flatMap((origin) => origin.localStorage);

    const hasGeneratedExtraStorage = localStorageValues.some(
      (localStorage) =>
        localStorage.name === 'foo-localStorage' && localStorage.value === 'bar-localStorage',
    );

    expect(localStorageValues.length).toBeGreaterThan(1);
    expect(hasGeneratedExtraStorage).toBe(true);
  });

  test('should re-hydrate and store again cookies and localStorage from an object - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const storageStateFile = join(__dirname, 'storage-state.json');
    const stringifiedStorageState = readFileSync(storageStateFile).toString();
    const storageState = JSON.parse(stringifiedStorageState) as StorageState;
    const storyBookComponentsTree = p
      .selector('div#storybook-explorer-tree')
      .find('button')
      .withText('COMPONENTS');

    // When
    await p
      .withBrowser(browser)
      .withCursor()
      .withOptions({ headless: false })
      .withStorageState(storageState)
      .navigateTo(url)
      .hover(storyBookComponentsTree);

    const finalStorageStateFile = join(__dirname, 'final-storage-state.json');
    await p.saveStorageStateTo(finalStorageStateFile).wait(3000);
    const finalStorageState = JSON.parse(
      readFileSync(finalStorageStateFile).toString(),
    ) as StorageState;

    // Then the foo=bar cookie should be saved again
    expect(finalStorageState).toBeDefined();

    expect(finalStorageState!.cookies).toBeDefined();

    expect(finalStorageState!.cookies?.length).toBeGreaterThanOrEqual(1);

    const hasGeneratedExtraCookie = finalStorageState!.cookies!.some(
      (cookie) => cookie.name === 'foo' && cookie.value === 'bar',
    );
    expect(hasGeneratedExtraCookie).toBe(true);

    // And the localStorage foobar should be re-hydrated

    expect(finalStorageState!.origins).toBeDefined();

    const localStorageValues = finalStorageState!
      .origins!.filter((origin) => origin.origin === 'https://reactstrap.github.io')!
      .flatMap((origin) => origin.localStorage);

    const hasGeneratedExtraStorage = localStorageValues.some(
      (localStorage) =>
        localStorage.name === 'foo-localStorage' && localStorage.value === 'bar-localStorage',
    );

    expect(localStorageValues.length).toBeGreaterThan(1);
    expect(hasGeneratedExtraStorage).toBe(true);
  });
});
