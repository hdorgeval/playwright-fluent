import * as SUT from '.';
import { Page } from 'playwright';

describe('exists', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when page has not been initalized', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot check that 'foobar' exists because no browser has been launched",
    );
    await SUT.exists('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
