import { Page } from 'playwright';
import * as SUT from '../index';
import { FluentMock } from '../with-mocks';

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

  test('should return an error when mock provides both a raw response and a json response', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      jsonResponse: () => {
        return { foo: 'bar' };
      },
      rawResponse: () => 'foo',
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock foobar' should either implement a json response or a raw response but not both.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });

  test('should return an error when mock provides a raw response but response type is set to json', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'json',
      rawResponse: () => 'foo',
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock foobar' should implement a json response instead of a raw response, because you explicitely set the response type to be json.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });

  test('should return an error when mock provides a json response but response type is set to string', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'string',
      jsonResponse: () => {
        return { foo: 'bar' };
      },
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock foobar' should implement a raw response instead of a json response, because you explicitely set the response type to be a string.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });

  test('should return an error when mock provides a json response but response type is set to empty', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'empty',
      jsonResponse: () => {
        return { foo: 'bar' };
      },
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock foobar' should not implement a json response, because you explicitely set the response type to be empty.",
    );

    expect(() => SUT.validateMock(mock)).toThrowError(expectedError);
  });

  test('should return an error when mock provides a raw response but response type is set to empty', async (): Promise<void> => {
    // Given
    const mock: Partial<FluentMock> = {
      displayName: 'mock foobar',
      urlMatcher: (url) => url.includes('/foobar'),
      responseType: 'empty',
      rawResponse: () => 'foo',
    };

    // Then
    const expectedError = new Error(
      "mock named 'mock foobar' should not implement a raw response, because you explicitely set the response type to be empty.",
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
