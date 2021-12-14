import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect has placeholder', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
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
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'foo' has placeholder 'bar' because no browser has been launched",
    );
  });

  test('should give back an error on expectThat(selector-fluent).hasPlaceholder when browser has not been launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foo');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThat(selector).hasPlaceholder('bar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check that 'selector(foo)' has placeholder 'bar' because no browser has been launched",
    );
  });
});
