import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect is unchecked', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.isUnchecked when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foobar').isUnchecked();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot get checked status of 'foobar' because no browser has been launched",
    );
  });
});
