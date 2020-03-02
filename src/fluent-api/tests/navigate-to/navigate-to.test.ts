import * as SUT from '../../playwright-fluent';

describe('Playwright Controller - navigateTo', (): void => {
  let pwc: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should give back an error on navigating to an url without launching the browser', async (): Promise<
    void
  > => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc.navigateTo('https://www.google.fr');
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
    await pwc
      .withBrowser('chromium')
      .navigateTo(url);

    // Then
    expect(await pwc.getCurrentUrl()).toBe(`${url}/`);
    expect(pwc.lastError()).toBe(undefined);
  });

  test('should navigate to url with firefox', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pwc
      .withBrowser('firefox')
      .navigateTo(url);

    // Then
    expect(await pwc.getCurrentUrl()).toBe(`${url}/`);
    expect(pwc.lastError()).toBe(undefined);
  });

  test('should navigate to url with webkit', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pwc
      .withBrowser('webkit')
      .navigateTo(url);

    // Then
    expect(await pwc.getCurrentUrl()).toBe(`${url}/`);
    expect(pwc.lastError()).toBe(undefined);
  });
});
