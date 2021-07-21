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
  test('should return an error when mock response type is string but a json provider is given', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock for GET /foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'string',
      jsonResponse: () => {
        return { foo: 'bar' };
      },
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock for GET /foobar' should implement a raw response instead of a json response, because you explicitely set the response type to be a string.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });
});
