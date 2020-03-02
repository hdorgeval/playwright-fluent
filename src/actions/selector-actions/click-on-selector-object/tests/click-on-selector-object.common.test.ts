import { PlaywrightFluent } from '../../../../controller';
import * as SUT from '../index';
import { defaultClickOptions } from '../../../handle-actions';
describe('click on selector object', (): void => {
  let pwc: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should throw an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      const selector = pwc.selector('foobar');
      await SUT.clickOnSelectorObject(selector, pwc.currentPage(), defaultClickOptions);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot click on 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
