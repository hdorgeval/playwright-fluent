import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - double-click', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on double-click when browser is not launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.doubleClick('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot double-click on 'foobar' because no browser has been launched",
    );
  });

  test('should give back an error on double-click(selector-fluent) when browser is not launched', async (): Promise<void> => {
    // Given
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.doubleClick(selector);
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot double-click on 'selector(foobar)' because no browser has been launched",
    );
  });
});
