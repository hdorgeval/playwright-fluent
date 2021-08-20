import * as SUT from '../../playwright-fluent';
import { stringifyRequest, RequestInfo, toRequestInfo } from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('Playwright Fluent - withMocks()', (): void => {
  let p: SUT.PlaywrightFluent;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1234);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1234
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should intercept GET requests to a rest API', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(`${path.join(__dirname, 'with-mocks.test.html')}`);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/app')
        .willReturn(htmlContent.toString(), 200);

    interface CustomResponseBody {
      prop1: string;
      prop2?: string;
    }

    const responseBody: CustomResponseBody = {
      prop1: 'foobar',
    };
    const responseBodyBaz: CustomResponseBody = {
      prop1: 'foobaz',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBodyBaz, 200, responseHeaders);

    // When
    const mockedResponseBody: CustomResponseBody = { prop1: 'mocked-prop1', prop2: 'mocked-prop2' };
    const mock1: Partial<SUT.FluentMock> = {
      displayName: 'mock GET /foobar requests',
      urlMatcher: (url) => url.includes('/foobar'),
      methodMatcher: (method) => method === 'GET',
      responseType: 'json',
      jsonResponse: () => mockedResponseBody,
      enrichResponseHeaders: (headers) => {
        return {
          ...headers,
          ...responseHeaders,
        };
      },
    };
    const mocks = [mock1];

    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .withMocks(mocks)
      .navigateTo('http://localhost:1234/app');

    // Then requests to /foobar should be intercepted
    // And response should be mocked
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 1000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect(sentRequest.url).toContain('?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.headers['foo-header']).toBe(responseHeaders['foo-header']);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.payload).toMatchObject(mockedResponseBody);
  });

  test('should intercept GET requests to a rest API only for the second request', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(`${path.join(__dirname, 'with-mocks.test.html')}`);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/app')
        .willReturn(htmlContent.toString(), 200);

    interface CustomResponseBody {
      prop1: string;
      prop2?: string;
    }

    const responseBody: CustomResponseBody = {
      prop1: 'foobar',
    };
    const responseBodyBaz: CustomResponseBody = {
      prop1: 'foobaz',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBodyBaz, 200, responseHeaders);

    interface MyContext {
      callIndex: number;
    }

    let numberOfCall = 0;

    const mock1: Partial<SUT.FluentMock> = {
      displayName: 'GET /yo?foo=baz1 requests - simulate throttling',
      urlMatcher: (url) => url.includes('/yo'),
      methodMatcher: (method) => method === 'GET',
      queryStringMatcher: (q) => q.foo === 'baz1',
      contextMatcher: (ctx) => {
        numberOfCall += 1;
        const context = ctx as MyContext;
        if (typeof context.callIndex !== 'number') {
          context.callIndex = 0;
        }
        context.callIndex += 1;
        return context.callIndex === 2;
      },
      responseType: 'string',
      rawResponse: () => 'sorry, tow many requests',
      status: 429,
    };
    const mocks = [mock1];

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/yo')
      .withMocks(mocks)
      .navigateTo('http://localhost:1234/app');

    // Then requests to /foobar should be intercepted
    // And response should be mocked
    await p.waitUntil(async () => p.getRecordedRequestsTo('/yo').length >= 3, {
      stabilityInMilliseconds: 1000,
    });
    const yoRequests = p.getRecordedRequestsTo('yo?foo=baz1');
    expect(Array.isArray(yoRequests)).toBe(true);
    expect(yoRequests.length).toBe(3);
    expect(numberOfCall).toBe(3);
    const firstRequest = await toRequestInfo(yoRequests[0]);
    const secondRequest = await toRequestInfo(yoRequests[1]);
    const thirdRequest = await toRequestInfo(yoRequests[2]);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(firstRequest.response!.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(secondRequest.response!.status).toBe(429);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(thirdRequest.response!.status).toBe(200);
  });

  test('should intercept GET requests to a rest API by responding with HTTP Status 401 with a 10s delay', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(`${path.join(__dirname, 'with-mocks.test.html')}`);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/app')
        .willReturn(htmlContent.toString(), 200);

    interface CustomResponseBody {
      prop1: string;
      prop2?: string;
    }

    const responseBody: CustomResponseBody = {
      prop1: 'foobar',
    };
    const responseBodyBaz: CustomResponseBody = {
      prop1: 'foobaz',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBodyBaz, 200, responseHeaders);

    const mock1: Partial<SUT.FluentMock> = {
      displayName: 'return HTTP 401 on GET /foobar requests',
      urlMatcher: (url) => url.includes('/foobar'),
      methodMatcher: (method) => method === 'GET',
      responseType: 'string',
      rawResponse: () => 'sorry, you have no access',
      status: 401,
      delayInMilliseconds: 10000,
    };
    const mocks = [mock1];

    // When
    const startTime = new Date();
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .withMocks(mocks)
      .navigateTo('http://localhost:1234/app');

    // Then requests to /foobar should be intercepted
    // And response should be mocked
    await p.waitUntil(async () => p.getRecordedRequestsTo('/foobar').length >= 1, {
      stabilityInMilliseconds: 1000,
    });

    const endTime = new Date();
    const elapsedInMilliseconds = endTime.getTime() - startTime.getTime();
    expect(Math.abs(elapsedInMilliseconds)).toBeGreaterThanOrEqual(10000);

    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect(sentRequest.url).toContain('?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.status).toBe(401);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.headers['content-type']).toBe('text/plain');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.headers['access-control-allow-origin']).toBe('*');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.headers['access-control-allow-credentials']).toBe('true');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.payload).toBe('sorry, you have no access');
  });
});
