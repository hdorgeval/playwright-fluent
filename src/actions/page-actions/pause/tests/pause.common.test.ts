import * as SUT from '../index';
import { Page } from 'playwright';

describe('pause', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error('Cannot pause because no browser has been launched');
    await SUT.pause(page).catch((error): void => expect(error).toMatchObject(expectedError));
  });
});
