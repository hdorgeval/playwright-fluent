# Playwright Fluent Mock API

!!! Still in beta testing !!!

The Mock API provides a generic and simple infrastructure for massive request interception and response mocking.

This Mock API leverages the `Playwright` request interception infrastructure and will enable you to mock all HTTP requests in order to test the front in complete isolation from the backend.

- Chainable Methods

  - [withMocks(mocks[, options])](#withMocksmocks-options)

- Helper Methods

  - `mockGetWithJsonResponse`
  - `mockGetWithJsonResponseDependingOnQueryString`
  - `mockGetWithJavascriptResponse`
  - `mockGetWithEmptyResponseAndStatus`
  - `mockPostWithEmptyResponseAndStatus`
  - `mockGetWithUnauthorizedResponse`
  - `mockGetWithForbiddenResponse`
  - `getOutdatedMocks`
  - `getMissingMocks`
  - `validateMock`

## Usage

To use the Mock API, you must first create a set of Mocks.

Basically, a mock is a literal object of type `Partial<FluentMock>`.

Example of a mock that will enable you to test HTTP 401 scenario on some specific requests:

```ts
import { FluentMock, mockGetWithUnauthorizedResponse } from 'playwright-fluent';

const mock: Partial<FluentMock> = {
  displayName: 'return HTTP 401 on GET /foobar requests after delaying the response to 10s',
  urlMatcher: (url) => url.includes('/foobar'),
  methodMatcher: (method) => method === 'GET',
  responseType: 'empty',
  status: 401,
  delayInMilliseconds: 10000,
};

// you could also create the same mock in one line of code:
const mock = mockGetWithUnauthorizedResponse('/foobar');
```

Example of a mock that will enable you to provide your own javascript:

```ts
import { FluentMock, mockGetWithJavascriptResponse } from 'playwright-fluent';

const mock: Partial<FluentMock> = {
  displayName: `GET /api/foo.js`,
  urlMatcher: (url) => url.includes('/api/foo.js'),
  methodMatcher: (m) => m === 'GET',
  responseType: 'javascript',
  rawResponse: () => `window.foo = 'bar';`,
};

// you could also create the same mock in one line of code:
const mock = mockGetWithJavascriptResponse('/api/foo.js', `window.foo = 'bar';`);
```

Example of a mock that provides a JSON object on specific URL and specific query string:

```ts
import { FluentMock, mockGetWithJsonResponseDependingOnQueryString } from 'playwright-fluent';

const response = {
  prop1: 'value1',
  prop2: 'value2',
};

const mock: Partial<FluentMock> = {
  displayName: `GET /api/yo?foo=bar`,
  urlMatcher: (url) => url.includes('/api/yo'),
  methodMatcher: (m) => m === 'GET',
  queryStringMatcher: (q) => q['foo'] === 'bar',
  responseType: 'json',
  jsonResponse: () => response,
};

// you could also create the same mock in one line of code:
const mock = mockGetWithJsonResponseDependingOnQueryString('/api/yo', { foo: 'bar' }, response);
```

Example of a mock that provides a JSON object on specific URL but only on the third request:

```ts
import { FluentMock } from 'playwright-fluent';

const response = {
  prop1: 'value1',
  prop2: 'value2',
};

const mock: Partial<FluentMock> = {
  displayName: `GET /api/foo/bar - third request only`,
  urlMatcher: (url) => url.includes('/api/foo/bar'),
  methodMatcher: (m) => m === 'GET',
  contextMatcher: (context) => {
    if (typeof context.fooBarCallIndex !== 'number') {
      context.fooBarCallIndex = 0;
    }
    context.fooBarCallIndex += 1;
    return context.foobarCallIndex === 3;
  },
  responseType: 'json',
  jsonResponse: () => response,
};
```

## Chainable Methods

---

### withMocks(mocks[, options])

- mocks: `Partial<FluentMock>[]`
- options: `Partial<WithMocksOptions>`

Provide a set of mocks in order to automatically handle request interceptions.

You can call `withMocks` multiple times with different set of mocks. In this case, all mocks are aggregated in an internal array and are all registered only once to request interception from `playwright`.

`FluentMock`:

```js
/**
 * Be able to intercept a given http request url and provide a mocked response.
 * The mock will be selected only if all provided matchers return true.
 * When a matcher is not provided, it always default to true.
 * When multiple mocks are selected, the last one is taken (like in CSS):
 *  this enables you to override existing mocks on specific conditions.
 * @export
 * @interface FluentMock
 */
export interface FluentMock {
  /**
   * Mock friendly name. Useful when you are debugging your mocks.
   * By default it will be set to 'not set' if you forgot to give your mock a name.
   * @type {string}
   * @memberof FluentMock
   */
  displayName: string;

  /**
   * Predicate acting on the http request url.
   * If you return true for the input url, then the request will be mocked accordingly to the responseType.
   * If you return false, the the request will never be mocked and other matchers will never be called.
   * @memberof FluentMock
   */
  urlMatcher: (url: string) => boolean;

  /**
   * Optional predicate acting on the http request method.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a methodMatcher, a default one that always returns true is provided.
   * @memberof FluentMock
   */
  methodMatcher: (method: HttpRequestMethod) => boolean;

  /**
   * Optional predicate acting on the query string.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a queryStringMatcher, a default one that always returns true is provided.
   *
   * @memberof FluentMock
   */
  queryStringMatcher: (queryString: QueryString) => boolean;

  /**
   * Optional predicate acting on the post data sent by the http request.
   * This predicate will be called only if the predicate urlMatcher returns true.
   * If you do not set a postDataMatcher, a default one that always returns true is provided.
   *
   * @memberof FluentMock
   */
  postDataMatcher: (postData: PostData) => boolean;

  /**
   * Optional predicate acting on the shared context.
   * This predicate will be called only if all predicates {@link urlMatcher}, {@link queryStringMatcher}, {@link postDataMatcher}, returns true.
   * If you do not set a contextMatcher, a default one that always returns true is provided.
   * A mock can update the shared context on any method passing a {@link RequestInfos} object.
   * A context matcher should be used when the mock response depends on the requests history,
   * for example when the mock must respond only to the nth request given by the urlMatcher.
   *
   * @memberof FluentMock
   */
  contextMatcher: (context: unknown) => boolean;

  /**
   * Add or modify the headers that will be sent with the mocked response.
   *
   * @memberof FluentMock
   */
  enrichResponseHeaders: (headers: HttpHeaders) => HttpHeaders;

  /**
   * Define the response type of the mocked request.
   * If you do not set a responseType, a default one will be infered from the provided jsonResponse or rawResponse.
   *
   * @type {('json' | 'string' | 'javascript' | 'empty' | 'continue')}
   * @memberof FluentMock
   */
  responseType: 'json' | 'string' | 'javascript' | 'empty' | 'continue';

  /**
   * Http response status. Can be a function that returns a number.
   * defaults to 200.
   *
   * @memberof FluentMock
   */
  status: number | ((requestInfos: RequestInfos) => number);

  /**
   * Build your own json response.
   * This method will be called only if responseType is 'json'.
   * @memberof FluentMock
   */
  jsonResponse: (requestInfos: RequestInfos) => ResponseData;

  /**
   * Build your own string response.
   * This method will be called only if responseType is 'string' or 'javascript'.
   *
   * @memberof FluentMock
   */
  rawResponse: (requestInfos: RequestInfos) => string;

  /**
   * Delay the response by the given number of milliseconds.
   * Defaults to 0.
   *
   * @type {number}
   * @memberof FluentMock
   */
  delayInMilliseconds: number;

  /**
   * Optional callback to update the data source of the mocked response.
   * When provided, this method will be called automatically when the mock is found to be outdated by the helper (see `getOutdatedMocks`).
   * @memberof FluentMock
   */
  updateData: (requestInfos: RequestInfos, response: ResponseData) => void;
}
```

`WithMocksOptions`:

```js
export interface WithMocksOptions {
  onMockNotFound: (requestInfos: {
    request: Request,
    queryString: QueryString,
    postData: PostData,
  }) => void;
  onMockFound: (
    mock: Partial<FluentMock>,
    requestInfos: {
      request: Request,
      queryString: QueryString,
      postData: PostData,
    },
  ) => void;
}
```

Example:

```js
const browser = 'chromium';
const p = new PlaywrightFluent();
const storageStateFile = join(__dirname, 'storage-state.json');

const mock1: Partial<FluentMock> = {
  displayName: 'return HTTP 401 on GET /foobar requests after delaying the response by 10s',
  urlMatcher: (url) => url.includes('/foobar'),
  methodMatcher: (method) => method === 'GET',
  responseType: 'string',
  rawResponse: () => 'sorry, you have no access',
  status: 401,
  delayInMilliseconds: 10000,
};

const mockedResponseBody = { foo: 'bar' }; // you custom mocked response
const mock2: Partial<FluentMock> = {
  displayName: 'mock for GET /api/baz?foo=bar',
  urlMatcher: (url) => url.includes('/api'),
  queryStringMatcher: (queryString) => queryString.foo === 'bar',
  methodMatcher: (method) => method === 'GET',
  enrichResponseHeaders: (headers) => {
    return {
      ...headers,
      'foo-header': 'bar',
    };
  },
  jsonResponse: () => mockedResponseBody,
  status: 200,
};

const mocks = [mock1, mock2];

// prettier-ignore
await p
  .withBrowser(browser)
  .withMocks(mocks)
  .navigateTo('example.com');
```

A mock is just a literal object whose `xxxResponse` property will be called automatically when each provided matchers return true for any given request sent by the front.

[Helpers](../src/actions/page-actions/with-mocks/mock-creators.ts) are provided to handle simple mock creation:

- `mockGetWithJsonResponse`
- `mockGetWithJsonResponseDependingOnQueryString`
- `mockGetWithJavascriptResponse`
- `mockGetWithEmptyResponseAndStatus`
- `mockPostWithEmptyResponseAndStatus`
- `mockGetWithUnauthorizedResponse`
- `mockGetWithForbiddenResponse`

## How to keep mocks up-to-date

Mocks are great until they are outdated.

Being able to detect that a mock is outdated is essential.

You can automatically pinpoint outdated mocks in the following way:

```ts
import { getOutdatedMocks } from 'playwright-fluent';

await p
  .withBrowser('chromium')
  .withOptions({ headless: true })
  .recordRequestsTo('/')
  .navigateTo(url);
// ... do all interactions on the real web site without doing any interception

await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/').length, {
  stabilityInMilliseconds: 1000,
});

const allRequests = p.getRecordedRequestsTo('/');

// now replay all real requests against the mocks
// and compare the response given by the mock with the real one
const outdatedMocks = await getOutdatedMocks(mocks, allRequests, defaultMocksOptions);
```

If you provide an `updateData` callback in your mocks, then the `getOutdatedMocks` will call this method for all mocks that have been detected as outdated.

The net effect of this is that each mock will update its own data source and therefore will always stay up-to-date !

## Helper Methods

TBD
