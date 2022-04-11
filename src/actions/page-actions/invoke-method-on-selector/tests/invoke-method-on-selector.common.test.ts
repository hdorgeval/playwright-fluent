import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultInvokeOptions } from '../index';

describe('invoke-method-on-selector', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot invoke method 'click' on 'foobar' because no browser has been launched",
    );
    await SUT.invokeMethodOnSelector('click', 'foobar', page, defaultInvokeOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
