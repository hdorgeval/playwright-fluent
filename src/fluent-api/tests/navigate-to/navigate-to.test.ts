import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - navigateTo', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on navigating to an url without launching the browser', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.navigateTo('https://www.google.fr');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot navigate to 'https://www.google.fr' because no browser has been launched",
    );
  });

  test('should navigate to url with chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .navigateTo(url);

    // Then
    expect(await p.getCurrentUrl()).toBe(`${url}/`);
    expect(p.lastError()).toBe(undefined);
  });

  test('should navigate to url with firefox', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await p
      .withBrowser('firefox')
      .navigateTo(url);

    // Then
    expect(await p.getCurrentUrl()).toBe(`${url}/`);
    expect(p.lastError()).toBe(undefined);
  });

  test('should navigate to url with webkit', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await p
      .withBrowser('webkit')
      .navigateTo(url);

    // Then
    expect(await p.getCurrentUrl()).toBe(`${url}/`);
    expect(p.lastError()).toBe(undefined);
  });
});
