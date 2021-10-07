import * as SUT from '../index';
import { Dialog, Page } from 'playwright';

describe('accept page dialog', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const dialog: Dialog | undefined = undefined;

    // When
    // Then
    const expectedError = new Error('Cannot accept dialog because no browser has been launched');
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await SUT.acceptDialog(dialog, 'foobar', page, () => {}).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
