import { PlaywrightFluent } from '../../../../fluent-api';
import * as SUT from '../index';
import { defaultSelectOptions } from '../../../handle-actions';
describe('select options in selector object', (): void => {
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
      await SUT.selectOptionsInSelectorObject(
        selector,
        ['label 1'],
        p.currentPage(),
        defaultSelectOptions,
      );
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot select options 'label 1' in 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
