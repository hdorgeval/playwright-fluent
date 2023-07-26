import * as path from 'path';
import { readFileSync } from 'fs';
import { FakeServer } from 'simple-fake-server';
import * as SUT from '../../playwright-fluent';
import { stringifyRequest, RequestInfo } from '../../../utils';

describe('Playwright Fluent - onRequestTo(url).respondWith()', (): void => {
  let p: SUT.PlaywrightFluent;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1243);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1243
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
    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-with.test.html')}`,
    );

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

    const mockResponseBody: CustomResponseBody = { prop1: 'mocked-prop1', prop2: 'mocked-prop2' };

    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .onRequestTo('/foobar')
      .respondWith<CustomResponseBody>({
        status: 200,
        headers: responseHeaders,
        body: mockResponseBody,
      })
      .navigateTo('http://localhost:1243/app');

    // Then requests to /foobar should be intercepted
    // And response should be mocked
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 5000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect(sentRequest.url).toContain('?foo=bar');

    expect(sentRequest.response!.status).toBe(200);

    expect(sentRequest.response!.headers['foo-header']).toBe(responseHeaders['foo-header']);

    expect(sentRequest.response!.payload).toMatchObject(mockResponseBody);
  });

  test('should intercept GET requests to a rest API -functional version', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-with.test.html')}`,
    );

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

    const mockResponseBody: CustomResponseBody = { prop1: 'mocked-prop1', prop2: 'mocked-prop2' };

    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .onRequestTo('/foobar')
      .respondWith<CustomResponseBody>((request) => {
        const url = request.url();
        if (url.includes('?foo=bar')) {
          return {
            status: 200,
            headers: responseHeaders,
            body: mockResponseBody,
          };
        }
        throw new Error(`Cannot handle to request '${url}'`);
      })
      .navigateTo('http://localhost:1243/app');

    // Then requests to /foobar should be intercepted
    // And response should be mocked
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 5000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect(sentRequest.url).toContain('?foo=bar');

    expect(sentRequest.response!.status).toBe(200);

    expect(sentRequest.response!.headers['foo-header']).toBe(responseHeaders['foo-header']);

    expect(sentRequest.response!.payload).toMatchObject(mockResponseBody);
  });

  test('should intercept GET requests to a rest API by responding with HTTP Status 401', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-with.test.html')}`,
    );

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
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .onRequestTo('/foobar')
      .respondWith({
        status: 401,
        body: 'sorry, you have no access',
      })
      .navigateTo('http://localhost:1243/app');

    // Then requests to /foobar should be intercepted
    // And response should be mocked
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 5000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect(sentRequest.url).toContain('?foo=bar');

    expect(sentRequest.response!.status).toBe(401);

    expect(sentRequest.response!.headers['content-type']).toBe('text/plain');

    expect(sentRequest.response!.headers['access-control-allow-origin']).toBe('*');

    expect(sentRequest.response!.headers['access-control-allow-credentials']).toBe('true');

    expect(sentRequest.response!.payload).toBe('sorry, you have no access');
  });
});
