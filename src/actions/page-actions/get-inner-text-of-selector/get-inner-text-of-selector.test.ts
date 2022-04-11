import { Page } from 'playwright';
import { defaultWaitUntilOptions } from '../../../utils';
import * as SUT from './index';

describe('get-inner-text-of-selector', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot get inner text of 'foobar' because no browser has been launched",
    );
    await SUT.getInnerTextOfSelector('foobar', page, defaultWaitUntilOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
