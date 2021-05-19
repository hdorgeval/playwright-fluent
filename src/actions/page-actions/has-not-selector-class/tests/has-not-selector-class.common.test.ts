import * as SUT from '../index';
import { defaultWaitUntilOptions } from '../../../../utils';
import { Page } from 'playwright';

describe('has-not-selector-class', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when page has not been initialized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check that 'foobar' does not have class 'yo' because no browser has been launched",
    );
    await SUT.hasNotSelectorClass('foobar', 'yo', page, defaultWaitUntilOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
