import * as SUT from '../index';
import { Page } from 'playwright';

describe('type text', (): void => {
  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot type text 'foobar' because no browser has been launched",
    );
    await SUT.typeText('foobar', page, SUT.defaultTypeTextOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
