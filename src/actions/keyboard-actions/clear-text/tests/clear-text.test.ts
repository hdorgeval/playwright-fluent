import * as SUT from '../index';
import { defaultTypeTextOptions } from '../../typetext';
import { Page } from 'playwright';

describe('clear text', (): void => {
  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error('Cannot clear text because no browser has been launched');
    await SUT.clearText(page, defaultTypeTextOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
