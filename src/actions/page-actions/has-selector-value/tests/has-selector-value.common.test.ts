import { Page } from 'playwright';
import * as SUT from '../index';
import { defaultWaitUntilOptions } from '../../../../utils';

describe('has-selector-value', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check value of 'foobar' because no browser has been launched",
    );
    await SUT.hasSelectorValue('foobar', 'value', page, defaultWaitUntilOptions).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });
});
