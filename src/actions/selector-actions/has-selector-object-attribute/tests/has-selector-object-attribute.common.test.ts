import { PlaywrightFluent, defaultWaitUntilOptions } from '../../../../fluent-api';
import * as SUT from '../index';
describe('has selector object attribute with expected value', (): void => {
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
      await SUT.hasSelectorObjectAttribute(
        selector,
        'data-id',
        'yo',
        p.currentPage(),
        defaultWaitUntilOptions,
      );
    } catch (error) {
      result = error as Error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot check that 'selector(foobar)' has attribute 'data-id' with value 'yo' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
