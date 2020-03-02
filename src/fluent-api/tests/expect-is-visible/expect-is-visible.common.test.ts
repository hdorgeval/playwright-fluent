import * as SUT from '../../playwright-fluent';

describe('Playwright Controller - expect is visible', (): void => {
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

  test('should give back an error on expectThat.isVisible when browser has not been launched', async (): Promise<
    void
  > => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc.expectThat('foobar').isVisible();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot get visibility status of 'foobar' because no browser has been launched",
    );
  });
});
