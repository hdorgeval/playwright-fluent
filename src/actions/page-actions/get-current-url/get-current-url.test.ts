import { Page } from 'playwright';
import * as SUT from './index';

describe('get-current-url', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      'Cannot get current page url because no browser has been launched',
    );
    await SUT.getCurrentUrl(page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
