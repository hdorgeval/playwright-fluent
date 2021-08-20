import { PlaywrightFluent, defaultWaitUntilOptions } from '../../../../fluent-api';
import * as SUT from '../index';
describe('has selector object exact expected value', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      const selector = p.selector('foobar');
      await SUT.hasSelectorObjectExactValue(
        selector,
        'value',
        p.currentPage(),
        defaultWaitUntilOptions,
      );
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot check exact value of 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
