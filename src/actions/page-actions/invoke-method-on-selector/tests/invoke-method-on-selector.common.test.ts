import * as SUT from '../index';
import { defaultInvokeOptions } from '../index';
import { Page } from 'playwright';

describe('invoke-method-on-selector', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

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
