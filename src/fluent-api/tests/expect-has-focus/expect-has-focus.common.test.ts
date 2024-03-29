import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect has focus', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.hasFocus when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foobar').hasFocus();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot get the focus state of 'foobar' because no browser has been launched",
    );
  });

  test('should give back an error on expectThat(selector-fluent).hasFocus when browser has not been launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThat(selector).hasFocus();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot get the focus state of 'selector(foobar)' because no browser has been launched",
    );
  });
});
