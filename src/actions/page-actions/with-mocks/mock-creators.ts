import { FluentMock, QueryString } from './with-mocks';
export function mockGetWithJsonResponse<T>(relativeUrl: string, response: T): Partial<FluentMock> {
  return {
    displayName: `GET ${relativeUrl}`,
    urlMatcher: (url) => url.includes(relativeUrl),
    methodMatcher: (m) => m === 'GET',
    jsonResponse: () => response,
  };
}

export function mockGetWithJsonResponseDependingOnQueryString<T>(
  relativeUrl: string,
  queryString: QueryString,
  response: T,
): Partial<FluentMock> {
  const searchParams = new URLSearchParams(queryString);
  return {
    displayName: `GET ${relativeUrl}?${searchParams.toString()}`,
    methodMatcher: (m) => m === 'GET',
    urlMatcher: (url) => url.includes(relativeUrl),
    queryStringMatcher: (qs) => {
      let match = true;
      for (const key in queryString) {
        if (qs && qs[key] === undefined) {
          match = false;
          break;
        }
        if (qs && qs[key] && qs[key] !== queryString[key]) {
          match = false;
          break;
        }
      }
      return match;
    },
    jsonResponse: () => response,
  };
}
