import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - onRequestTo(url).respondFromHar()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await p
        .onRequestTo('/foobar')
        .respondFromHar(['foo.har', 'bar.har']);
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot intercept requests to '/foobar' because no browser has been launched",
    );
  });
});
