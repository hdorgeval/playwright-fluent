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
import { FluentMock } from 'playwright-fluent';

const mock: Partial<FluentMock> = {
  displayName: 'return HTTP 401 on GET /foobar requests after delaying the response to 10s',
  urlMatcher: (url) => url.includes('/foobar'),
  methodMatcher: (method) => method === 'GET',
  responseType: 'empty',
  status: 401,
  delayInMilliseconds: 10000,
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

Mocks are great until they are outdated. Being able to detect that a mock is outdated is essential.

You can automatically pinpoint outdated mocks in the following way:

```ts
import { getOutdatedMocks } from 'playwright-fluent';

await p
  .withBrowser('chromium')
  .withOptions({ headless: true })
  .recordRequestsTo('/')
  .navigateTo(url);

await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/').length, {
  stabilityInMilliseconds: 1000,
});

const allRequests = p.getRecordedRequestsTo('/');
const outdatedMocks = await getOutdatedMocks(mocks, allRequests, defaultMocksOptions);
```

---

## Helper Methods
