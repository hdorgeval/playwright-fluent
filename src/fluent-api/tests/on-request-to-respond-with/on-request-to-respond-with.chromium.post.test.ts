import * as SUT from '../../playwright-fluent';
import {
  stringifyRequest,
  RequestInfo,
  getHarResponseFor,
  getHarDataFrom,
  getHarResponseContentAs,
  harHeadersToHttpHeaders,
} from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('Playwright Fluent - onRequestTo(url).respondWith()', (): void => {
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
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should intercept POST requests to a rest API', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-with.post.test.html')}`,
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

    const mockResponseBody: CustomResponseBody = { prop1: 'mocked-prop1', prop2: 'mocked-prop2' };
    const harFile = path.join(__dirname, 'test.har');
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordNetworkActivity({ path: harFile })
      .recordRequestsTo('/foobar')
      .onRequestTo('/foobar')
      .respondWith<CustomResponseBody>({
        status: 200,
        headers: responseHeaders,
        body: mockResponseBody,
      })
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
    expect(sentRequest.response!.payload).toMatchObject(mockResponseBody);
  });

  test('should intercept POST requests to a rest API - functional version', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-with.post.test.html')}`,
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
    const mockResponseBody: CustomResponseBody = { prop1: 'mocked-prop1', prop2: 'mocked-prop2' };
    const harFile = path.join(__dirname, 'test.har');
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordNetworkActivity({ path: harFile })
      .recordRequestsTo('/foobar')
      .onRequestTo('/foobar?foo=bar')
      .respondWith<CustomResponseBody>((request) => {
        const url = request.url();
        // eslint-disable-next-line no-console
        console.log(url);
        return {
          status: 200,
          headers: responseHeaders,
          body: mockResponseBody,
        };
      })
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
    expect(sentRequest.response!.payload).toMatchObject(mockResponseBody);
  });

  test('should mock reponse with data coming from a HAR file', async (): Promise<void> => {
    // Given
    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-with.post.test.html')}`,
    );
    const harFile = path.join(__dirname, 'har-test.json');
    const harData = getHarDataFrom(harFile);
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

    const responseHeaders = {
      'foo-header': 'bar',
    };

    const mockResponseBody: CustomResponseBody = { prop1: 'mocked-prop1', prop2: 'mocked-prop2' };
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
      .onRequestTo('/foobar')
      .respondWith<CustomResponseBody>((request) => {
        const harResponse = getHarResponseFor(request, harData);
        const response = getHarResponseContentAs<CustomResponseBody>(harResponse);
        return {
          status: harResponse?.status,
          headers: harHeadersToHttpHeaders(harResponse?.headers),
          body: response,
        };
      })
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
    expect(sentRequest.response!.payload).toMatchObject(mockResponseBody);
  });
});
