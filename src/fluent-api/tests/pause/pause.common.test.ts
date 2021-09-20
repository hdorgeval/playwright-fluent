import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - pause', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should give back an error on pause without launching the browser', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.pause();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain('Cannot pause because no browser has been launched');
  });
});
