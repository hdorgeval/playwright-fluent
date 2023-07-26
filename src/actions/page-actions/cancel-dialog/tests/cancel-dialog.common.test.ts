import { Dialog, Page } from 'playwright';
import * as SUT from '../index';

describe('cancel page dialog', (): void => {
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const dialog: Dialog | undefined = undefined;

    // When
    // Then
    const expectedError = new Error('Cannot cancel dialog because no browser has been launched');

    await SUT.cancelDialog(dialog, page, () => {}).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
