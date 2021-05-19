import { PlaywrightFluent } from '../../../../fluent-api';
import * as SUT from '../index';
import { defaultClickOptions } from '../../../handle-actions';
describe('check selector object', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
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
      await SUT.checkSelectorObject(selector, p.currentPage(), defaultClickOptions);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot check 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
