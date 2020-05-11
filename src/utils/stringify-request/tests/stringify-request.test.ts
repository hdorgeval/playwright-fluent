import * as SUT from '../index';

describe('stringifyRequest', (): void => {
  test('should parse query string', async (): Promise<void> => {
    // Given
    const url =
      'https://reactstrap.github.io/components/form/?email=foo.bar%40baz.com&password=don%27t+tel+%21%21&select=3&selectMulti=1&selectMulti=3&selectMulti=5&text=bla+bla+bla&file=&radio1=on';

    // When
    const result = SUT.toQueryString(url);

    // Then
    expect(result.email).toBe('foo.bar@baz.com');
    expect(result.password).toBe("don't tel !!");
    expect(result.selectMulti).toMatchObject(['1', '3', '5']);
  });

  test('should parse empty query string', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form/?';

    // When
    const result = SUT.toQueryString(url);

    // Then
    expect(result).toMatchObject({});
  });

  test('should parse no query string', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form/';

    // When
    const result = SUT.toQueryString(url);

    // Then
    expect(result).toMatchObject({});
  });
});
