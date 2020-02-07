import * as SUT from './index';
import { Page } from 'playwright';

describe('get-current-url', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

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
