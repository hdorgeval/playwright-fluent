import { Page } from 'playwright';
import * as SUT from '.';

describe('navigate-to', (): void => {
  beforeEach((): void => {});

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot navigate to 'foobar' because no browser has been launched",
    );
    await SUT.navigateTo('foobar', SUT.defaultNavigationOptions, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
