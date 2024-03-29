import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - switchToIframe', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on switching to iframe without launching the browser', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.switchToIframe('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot switch to iframe from 'foobar' because no browser has been launched",
    );
  });
});
