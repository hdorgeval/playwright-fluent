import * as SUT from '../index';

describe('urlToShortPath(url)', (): void => {
  [
    { url: 'http://localhost:8080', shortPath: '/' },
    { url: 'http://localhost:8080?foo=bar', shortPath: '/?foo=bar' },
    { url: 'http://localhost:8080/foobar?foo=bar', shortPath: '/foobar?foo=bar' },
    { url: 'http://localhost:8080/api/v1/foobar?foo=bar', shortPath: '/v1/foobar?foo=bar' },
    { url: 'http://localhost:8080/api/foobar?foo=bar', shortPath: '/api/foobar?foo=bar' },
  ].forEach((testCase: { url: string; shortPath: string }): void => {
    test(`should extract the short path for url '${testCase.url}'`, async (): Promise<void> => {
      // Given
      // When
      const result = SUT.urlToShortPath(testCase.url);

      // Then
      expect(result).toBe(testCase.shortPath);
    });
  });
});
