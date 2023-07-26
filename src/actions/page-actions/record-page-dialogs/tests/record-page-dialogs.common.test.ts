import { Page } from 'playwright';
import * as SUT from '../index';

describe('record page dialogs', (): void => {
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    const callback = () => {};

    // When
    // Then
    const expectedError = new Error(
      'Cannot record page dialogs because no browser has been launched',
    );
    await SUT.recordPageDialogs(page, callback).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
