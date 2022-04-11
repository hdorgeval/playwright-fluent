import { Page } from 'playwright';
import * as SUT from '../index';

describe('hold down key', (): void => {
  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot hold down key 'Control' because no browser has been launched",
    );
    await SUT.holdDownKey('Control', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
