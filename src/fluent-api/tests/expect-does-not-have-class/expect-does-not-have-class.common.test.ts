import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect does not have class', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.doesNotHaveClass when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foo').doesNotHaveClass('bar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'foo' does not have class 'bar' because no browser has been launched",
    );
  });

  test('should give back an error on expectThat(selector-fluent).doesNotHaveClass when browser has not been launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foo');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThat(selector).doesNotHaveClass('bar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'selector(foo)' does not have class 'bar' because no browser has been launched",
    );
  });
});
