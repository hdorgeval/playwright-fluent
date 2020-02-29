import * as SUT from '../../controller';

describe('Playwright Controller - click', (): void => {
  let pwc: SUT.PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new SUT.PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should give back an error on hover without launching the browser', async (): Promise<
    void
  > => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc.click('foobar');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click on 'foobar' because no browser has been launched",
    );
  });
});
