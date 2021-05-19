import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - clearText', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error when browser is not launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.clearText();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot clear text because no browser has been launched',
    );
  });
});
