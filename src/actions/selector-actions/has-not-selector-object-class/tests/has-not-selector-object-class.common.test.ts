import { PlaywrightFluent, defaultWaitUntilOptions } from '../../../../fluent-api';
import * as SUT from '../index';
describe('selector object does not have expected class', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should throw an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      const selector = p.selector('foobar');
      await SUT.hasNotSelectorObjectClass(selector, 'yo', p.currentPage(), defaultWaitUntilOptions);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot check that 'selector(foobar)' does not have class 'yo' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
