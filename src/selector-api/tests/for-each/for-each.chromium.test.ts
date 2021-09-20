import { PlaywrightFluent } from '../../../fluent-api';
import * as path from 'path';

describe('Selector API - forEach', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      const selectors = p.selector('foobar');
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await selectors.forEach(async () => {});
    } catch (error) {
      result = error as Error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot query selector 'foobar' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });

  test('should do nothing on wrong selector', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'for-each.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    // When
    const selectors = p.selector('foobar');
    const fn = jest.fn();
    await selectors.forEach(fn);

    // Then
    expect(fn).toHaveBeenCalledTimes(0);
  });

  test('should check each checkbox', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'for-each.test.html')}`;
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .withDefaultWaitOptions({stabilityInMilliseconds: 0})
      .navigateTo(url);

    // When
    const rows = p.selector('[role="row"]');
    let count = 0;
    await rows.forEach(async (row, index) => {
      // eslint-disable-next-line no-console
      console.log(`processing row #${index}`);

      const checkbox = row.find('input[type="checkbox"]');
      await p.hover(checkbox).check(checkbox);
      count = index;
    });

    // Then
    expect(count).toBe(3);
    await rows.forEach(async (row) => {
      const checkbox = row.find('input[type="checkbox"]');
      await p.hover(checkbox).expectThat(checkbox).isChecked();
    });
  });

  test('should check each checkbox, even when selector is created before browser is launched', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'for-each.test.html')}`;
    const rows = p.selector('[role="row"]');

    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .withDefaultWaitOptions({stabilityInMilliseconds: 0})
      .navigateTo(url);

    // When
    await rows.forEach(async (row) => {
      const checkbox = row.find('input[type="checkbox"]');
      await p.hover(checkbox).check(checkbox);
    });

    // Then
    await rows.forEach(async (row) => {
      const checkbox = row.find('input[type="checkbox"]');
      await p.hover(checkbox).expectThat(checkbox).isChecked();
    });
  });
});
