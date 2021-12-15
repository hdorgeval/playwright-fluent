import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - click', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on click without launching the browser', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.click('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click on 'foobar' because no browser has been launched",
    );
  });

  test('should give back an error on click(selector-fluent) without launching the browser', async (): Promise<void> => {
    // Given
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p.click(selector);
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click on 'selector(foobar)' because no browser has been launched",
    );
  });
});
