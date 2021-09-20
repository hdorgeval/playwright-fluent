import { PlaywrightFluent } from '../../../../fluent-api';
import * as SUT from '../index';
import { defaultClickOptions } from '../../../handle-actions';
describe('uncheck selector object', (): void => {
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
      await SUT.uncheckSelectorObject(selector, p.currentPage(), defaultClickOptions);
    } catch (error) {
      result = error as Error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot uncheck 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
