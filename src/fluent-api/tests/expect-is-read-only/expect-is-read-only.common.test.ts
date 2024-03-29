import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - expect is read-only', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on expectThat.isReadonly when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector('foobar').isReadOnly();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot get readOnly status of 'foobar' because no browser has been launched",
    );
  });

  test('should give back an error on expectThat(selector-fluent).isReadonly when browser has not been launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.expectThatSelector(selector).isReadOnly();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot get readOnly status of 'selector(foobar)' because no browser has been launched",
    );
  });
});
