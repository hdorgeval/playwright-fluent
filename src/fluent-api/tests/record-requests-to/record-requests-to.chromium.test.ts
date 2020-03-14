import * as SUT from '../../playwright-fluent';
import { stringifyRequest, RequestInfo } from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

describe('Playwright Fluent - recordRequestsTo(url)', (): void => {
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
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should record successfull requests', async (): Promise<void> => {
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
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    fakeServer &&
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

  test('should record failed requests 500', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`;

    fakeServer &&
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);
    // When
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
});
