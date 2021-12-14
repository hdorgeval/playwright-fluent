import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect exists', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.exists when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foobar').exists();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'foobar' exists because no browser has been launched",
    );
  });

  test('should give back an error on expectThat(selector-fluent).exists when browser has not been launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThat(selector).exists();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'selector(foobar)' exists because no browser has been launched",
    );
  });
});
