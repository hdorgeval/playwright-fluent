import { Page } from 'playwright';
import * as SUT from '../index';

describe('on request to respond with', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const options: SUT.RequestInterceptionFilterOptions = {};
    const response: Partial<SUT.MockedResponse<Record<string, unknown>>> = {};
    // When
    // Then
    const expectedError = new Error(
      "Cannot intercept requests to '/foobar' because no browser has been launched",
    );

    await SUT.onRequestToRespondWith('/foobar', options, response, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
