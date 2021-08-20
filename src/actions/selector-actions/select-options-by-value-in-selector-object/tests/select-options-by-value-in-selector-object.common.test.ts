import { PlaywrightFluent } from '../../../../fluent-api';
import * as SUT from '../index';
import { defaultSelectOptions } from '../../../handle-actions';
describe('select options by value in selector object', (): void => {
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
      await SUT.selectOptionsByValueInSelectorObject(
        selector,
        ['value 1'],
        p.currentPage(),
        defaultSelectOptions,
      );
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot select options 'value 1' in 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
