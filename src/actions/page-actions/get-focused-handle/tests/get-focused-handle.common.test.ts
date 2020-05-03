import * as SUT from '../index';
import { Page } from 'playwright';

describe('get-focused-handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(60000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      'Cannot get focused handle because no browser has been launched',
    );
    await SUT.getFocusedHandle(page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
