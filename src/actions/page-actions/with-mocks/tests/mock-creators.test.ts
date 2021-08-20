import * as SUT from '../index';

describe('mock creators', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return a mock for GET json depending on query string', async (): Promise<void> => {
    // Given
    const response = {
      prop1: 'value1',
      prop2: 'value2',
    };
    const relativeUrl = '/api/yo';

    // When
    const mock = SUT.mockGetWithJsonResponseDependingOnQueryString(
      relativeUrl,
      { foo: 'bar' },
      response,
    );

    // Then
    expect(mock.displayName).toBe('GET /api/yo?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.urlMatcher!(`https://yo.com/api/yo?foo=baz`)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.urlMatcher!(`https://yo.com/api/go?foo=baz`)).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.queryStringMatcher!({ foo: 'bar' })).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.queryStringMatcher!({ foo: 'bar', bar: 'baz' })).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.queryStringMatcher!({ bar: 'baz' })).toBe(false);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.queryStringMatcher!({})).toBe(false);
  });

  test('should return a mock for GET json', async (): Promise<void> => {
    // Given
    const response = {
      prop1: 'value1',
      prop2: 'value2',
    };

    // When
    const mock = SUT.mockGetWithJsonResponse('/api/yo', response);

    // Then
    expect(mock.displayName).toBe('GET /api/yo');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.urlMatcher!(`https://yo.com/api/yo?foo=baz`)).toBe(true);
  });

  test('should return a mock for GET javascript', async (): Promise<void> => {
    // Given
    const response = `window.foo = 'bar';`;

    // When
    const mock = SUT.mockGetWithJavascriptResponse('/api/foo.js', response);

    // Then
    expect(mock.displayName).toBe('GET /api/foo.js');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.urlMatcher!(`https://yo.com/api/foo.js`)).toBe(true);
    expect(mock.responseType).toBe('javascript');
    expect(typeof mock.rawResponse).toBe('function');
  });

  test('should return a mock for GET that returns a 401', async (): Promise<void> => {
    // Given

    // When
    const mock = SUT.mockGetWithUnauthorizedResponse('/api/foo.js');

    // Then
    expect(mock.displayName).toBe('GET /api/foo.js');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.urlMatcher!(`https://yo.com/api/foo.js`)).toBe(true);
    expect(mock.responseType).toBe('empty');
    expect(typeof mock.methodMatcher).toBe('function');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.methodMatcher!(`GET`)).toBe(true);
    expect(mock.status).toBe(401);
  });

  test('should return a mock for GET that returns a 403', async (): Promise<void> => {
    // Given

    // When
    const mock = SUT.mockGetWithForbiddenResponse('/api/foo.js');

    // Then
    expect(mock.displayName).toBe('GET /api/foo.js');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.urlMatcher!(`https://yo.com/api/foo.js`)).toBe(true);
    expect(mock.responseType).toBe('empty');
    expect(typeof mock.methodMatcher).toBe('function');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(mock.methodMatcher!(`GET`)).toBe(true);
    expect(mock.status).toBe(403);
  });
});
