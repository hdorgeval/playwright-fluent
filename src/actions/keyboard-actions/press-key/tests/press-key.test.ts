import * as SUT from '../index';
import { Page } from 'playwright';

describe('type text', (): void => {
  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error("Cannot press key 'Tab' because no browser has been launched");
    await SUT.pressKey('Tab', page, SUT.defaultKeyboardPressOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
