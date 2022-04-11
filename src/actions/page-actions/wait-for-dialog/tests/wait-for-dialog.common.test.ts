import { Dialog, Page } from 'playwright';
import * as SUT from '../index';

describe('wait for page dialog to open', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const dialog: Dialog | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      'Cannot wait for a dialog to open because no browser has been launched',
    );
    await SUT.waitForDialog(() => dialog, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
