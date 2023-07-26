import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultWaitUntilOptions } from '../../../../utils';

describe('has-selector-aria-label', (): void => {
  beforeEach((): void => {});

  test('should return an error when page has not been initialized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check that 'foobar' has aria-label 'yo' because no browser has been launched",
    );
    await SUT.hasSelectorAriaLabel('foobar', 'yo', page, defaultWaitUntilOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
