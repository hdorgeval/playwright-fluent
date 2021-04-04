import * as SUT from '../index';
import { Page } from 'playwright';

describe('on request to respond with', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot intercept requests to '/foobar' because no browser has been launched",
    );
    await SUT.onRequestToRespondWith('/foobar', {}, () => false, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
