import * as SUT from '../index';
import { defaultWaitUntilOptions } from '../../../../utils';
import { Page } from 'playwright';

describe('has-selector-attribute', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when page has not been initialized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check that 'foobar' has attribute 'data-id' with value 'yo' because no browser has been launched",
    );
    await SUT.hasSelectorAttribute('foobar', 'data-id', 'yo', page, defaultWaitUntilOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
