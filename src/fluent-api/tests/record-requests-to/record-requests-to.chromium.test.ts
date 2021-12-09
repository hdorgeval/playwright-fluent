import * as SUT from '../../playwright-fluent';
import { stringifyRequest, RequestInfo } from '../../../utils';
import { mockGetWithJsonResponse } from '../../../actions';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

describe('Playwright Fluent - recordRequestsTo(url)', (): void => {
  let p: SUT.PlaywrightFluent;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1246);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1246
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

  test('should record successfull requests and ignore specific ones', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-requests-to.test.html')}`;

    const responseBody = {
      prop1: 'foobar',
    };
    const responseBodyBaz = {
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
        .delete()
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
      .recordRequestsTo('/foobar', (request) => request.method() === 'DELETE')
      .recordRequestsTo('/yo')
      .navigateTo(url);

    // Then requests to /foobar can be analyzed
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
    expect(sentRequest.response!.payload).toMatchObject(responseBody);

    // Then requests to /yo can be analyzed
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/yo').length, {
      stabilityInMilliseconds: 1000,
    });
    const yoRequests = p.getRecordedRequestsTo('/yo');
    expect(Array.isArray(yoRequests)).toBe(true);
    expect(yoRequests.length).toBe(2);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stringifiedYoRequest = await stringifyRequest(p.getLastRecordedRequestTo('/yo')!);
    const yoRequest = JSON.parse(stringifiedYoRequest) as RequestInfo;

    expect(yoRequest.url).toContain('?foo=baz2');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(yoRequest.response!.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(yoRequest.response!.payload).toMatchObject(responseBodyBaz);
  });

  test('should record post data fetch requests', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-requests-with-post-data-fetch.test.html')}`;

    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .post()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .navigateTo(url);

    // Then requests to /foobar can be analyzed
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 5000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect((sentRequest.postData as { foo: string }).foo).toBe('bar');
  });

  test('should record post data xhr requests', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-requests-with-post-data-xhr.test.html')}`;

    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .post()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar')
      .navigateTo(url);

    // Then requests to /foobar can be analyzed
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 5000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(foobarRequests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect((sentRequest.postData as { foo: string }).foo).toBe('bar');
  });

  test('should record failed requests 500', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`;

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/500')
      .navigateTo(url);

    // Then
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/500').length, {
      stabilityInMilliseconds: 2000,
    });
    const requests = p.getRecordedRequestsTo('/500');
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(requests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.statusText).toBe('Internal Server Error');
  });

  test('should get outdated mocks', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-requests-to.test.html')}`;

    const responseBody = {
      prop1: 'foobar',
    };
    const responseBodyBaz = {
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
        .delete()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/yo')
        .willReturn(responseBodyBaz, 200, responseHeaders);

    const mock = mockGetWithJsonResponse('/foobar', { ...responseBody, prop2: 'yo' });

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordRequestsTo('/foobar', (request) => request.method() === 'DELETE')
      .recordRequestsTo('/yo')
      .navigateTo(url);

    // Then requests to /foobar can be analyzed
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 1000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(1);

    const outdatedMocks = await SUT.getOutdatedMocks(
      [mock],
      foobarRequests,
      SUT.defaultMocksOptions,
    );

    expect(outdatedMocks.length).toBe(1);
  });
});
