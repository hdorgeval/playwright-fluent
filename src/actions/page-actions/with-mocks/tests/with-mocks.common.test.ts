import * as SUT from '../index';
import { FluentMock } from '../with-mocks';
import { Page } from 'playwright';

describe('with mocks', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const options: Partial<SUT.WithMocksOptions> = {};
    const mocks: FluentMock[] = [];

    // When
    // Then
    const expectedError = new Error(
      'Cannot intercept requests with mocks because no browser has been launched',
    );

    await SUT.withMocks(mocks, options, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
