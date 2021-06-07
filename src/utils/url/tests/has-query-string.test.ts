import * as SUT from '../index';

describe('hasQueryString(url)', (): void => {
  test('should detect query string', async (): Promise<void> => {
    // Given
    const url = 'http://localhost:8080/foobar?foo=bar';

    // When
    const result = SUT.hasQueryString(url);

    // Then
    expect(result).toBe(true);
  });
  test('should not detect query string', async (): Promise<void> => {
    // Given
    const url = 'http://localhost:8080/foobar/#';

    // When
    const result = SUT.hasQueryString(url);

    // Then
    expect(result).toBe(false);
  });

  test('should not detect empty query string', async (): Promise<void> => {
    // Given
    const url = 'http://localhost:8080/foobar?';

    // When
    const result = SUT.hasQueryString(url);

    // Then
    expect(result).toBe(false);
  });
});
