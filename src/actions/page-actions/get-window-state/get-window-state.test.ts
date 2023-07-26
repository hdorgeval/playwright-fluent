import { Page } from 'playwright';
import * as SUT from './index';

describe('get-window-state', (): void => {
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error('Cannot get window state because no browser has been launched');
    await SUT.getWindowState(page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
