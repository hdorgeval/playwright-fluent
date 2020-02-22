import { PlaywrightController } from '../../../../controller';
import * as SUT from '../index';
import { defaultHoverOptions } from '../../../handle-actions';
describe('hover on selector object', (): void => {
  let pwc: PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new PlaywrightController();
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
      await SUT.hoverOnSelectorObject(selector, pwc.currentPage(), defaultHoverOptions);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot hover on 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
