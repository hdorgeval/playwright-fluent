import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect has value', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.hasValue when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foo').hasValue('bar');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check value of 'foo' because no browser has been launched",
    );
  });
});
