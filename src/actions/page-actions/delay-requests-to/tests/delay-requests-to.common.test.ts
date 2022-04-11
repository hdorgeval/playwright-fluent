import { Page } from 'playwright';
import * as SUT from '../index';

describe('delay requests to', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot delay requests to '/foobar' because no browser has been launched",
    );
    await SUT.delayRequestsTo('/foobar', 10, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
