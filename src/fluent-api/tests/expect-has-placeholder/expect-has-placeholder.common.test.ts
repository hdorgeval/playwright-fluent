import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect has placeholder', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.hasPlaceholder when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foo').hasPlaceholder('bar');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'foo' has placeholder 'bar' because no browser has been launched",
    );
  });
});
