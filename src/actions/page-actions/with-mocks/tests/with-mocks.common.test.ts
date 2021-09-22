import * as SUT from '../index';
import { FluentMock } from '../with-mocks';
import { Page } from 'playwright';

describe('with mocks', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const options: Partial<SUT.WithMocksOptions> = {};
    const mocks: () => FluentMock[] = () => [];
    const sharedContext = {};
    // When
    // Then
    const expectedError = new Error(
      'Cannot intercept requests with mocks because no browser has been launched',
    );

    await SUT.withMocks(mocks, () => sharedContext, options, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should return an error when mocks is not a function', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const options: Partial<SUT.WithMocksOptions> = {};
    const mocks: Partial<SUT.WithMocksOptions>[] = [];
    const sharedContext = {};
    // When
    // Then
    const expectedError = new Error(
      'mocks must be a function that returns an array of FluentMock objects.',
    );

    await SUT.withMocks(
      mocks as unknown as () => Partial<FluentMock>[],
      () => sharedContext,
      options,
      page,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should return an error when mocks() is not an array', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const options: Partial<SUT.WithMocksOptions> = {};
    const mocks: () => string = () => 'foo';
    const sharedContext = {};
    // When
    // Then
    const expectedError = new Error(
      'mocks must be a function that returns an array of FluentMock objects.',
    );

    await SUT.withMocks(
      mocks as unknown as () => Partial<FluentMock>[],
      () => sharedContext,
      options,
      page,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
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

  test('should return an error when mock update policy is 1/d but no lastUpdated callback is given', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock for GET /foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'json',
      jsonResponse: () => {
        return { foo: 'bar' };
      },
      updatePolicy: '1/d',
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock for GET /foobar' should implement a lastUpdated callback when and updatePolicy of '1/d' is set.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });

  test('should return an error when mock update policy is 1/w but no lastUpdated callback is given', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock for GET /foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'json',
      jsonResponse: () => {
        return { foo: 'bar' };
      },
      updatePolicy: '1/w',
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock for GET /foobar' should implement a lastUpdated callback when and updatePolicy of '1/w' is set.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });

  test('should return an error when mock update policy is 1/m but no lastUpdated callback is given', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock for GET /foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'json',
      jsonResponse: () => {
        return { foo: 'bar' };
      },
      updatePolicy: '1/m',
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock for GET /foobar' should implement a lastUpdated callback when and updatePolicy of '1/m' is set.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });
});
