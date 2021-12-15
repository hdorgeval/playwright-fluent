import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect does not exist', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.doesNotExist when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foobar').doesNotExist();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'foobar' does not exist because no browser has been launched",
    );
  });

  test('should give back an error on expectThat(selector-fluent).doesNotExist when browser has not been launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThat(selector).doesNotExist();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'selector(foobar)' does not exist because no browser has been launched",
    );
  });
});
