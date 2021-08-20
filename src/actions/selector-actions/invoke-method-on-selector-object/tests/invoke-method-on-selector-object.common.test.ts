import { PlaywrightFluent } from '../../../../fluent-api';
import * as SUT from '../index';
import { defaultInvokeOptions, InvokeOptions } from '../../../page-actions';
describe('invoke method on selector object', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should throw an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const options: InvokeOptions = {
      ...defaultInvokeOptions,
      timeoutInMilliseconds: 1000,
    };

    // When
    let result: Error | undefined = undefined;
    try {
      const selector = p.selector('foobar').find('input');
      await SUT.invokeMethodOnSelectorObject('click', selector, options);
    } catch (error) {
      result = error;
    }

    // Then
    const expectedErrorMessage = `Cannot invoke method 'click' on 'selector(foobar)
  .find(input)' because this selector was not found in DOM`;
    expect(result && result.message).toContain(expectedErrorMessage);
  });
});
