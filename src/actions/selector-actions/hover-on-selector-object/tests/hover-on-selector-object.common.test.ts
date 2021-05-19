import { PlaywrightFluent } from '../../../../fluent-api';
import * as SUT from '../index';
import { defaultHoverOptions } from '../../../handle-actions';
describe('hover on selector object', (): void => {
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
      await SUT.hoverOnSelectorObject(selector, p.currentPage(), defaultHoverOptions);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage =
      "Cannot hover on 'selector(foobar)' because no browser has been launched";
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
