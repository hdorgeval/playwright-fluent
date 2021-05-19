import * as SUT from '../../playwright-fluent';
import { stringifyRequest, RequestInfo } from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

describe('Playwright Fluent - delayRequestsTo(url)', (): void => {
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
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should delay request', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'delay-requests-to.test.html')}`;

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
        .get()
        .to('/yo')
        .willReturn(responseBodyBaz, 200, responseHeaders);

    const harFilepath = `${path.join(__dirname, 'delay-requests-to.test.har')}`;
    const expectedDelayInSeconds = 10;
    const checkbox = 'input[type="checkbox"]';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .delayRequestsTo('/foobar', expectedDelayInSeconds)
      .recordRequestsTo('/foobar')
      .recordNetworkActivity({ path: harFilepath })
      .navigateTo(url);

    // Then button should be disabled while resquest is pending
    await p.hover(checkbox).expectThat(checkbox).isDisabled();

    // And request should still be in pending state
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: 1000,
    });
    const foobarRequests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(foobarRequests)).toBe(true);
    expect(foobarRequests.length).toBe(0);

    // When I wait for the request to be recorded
    await p.waitForStabilityOf(async () => p.getRecordedRequestsTo('/foobar').length, {
      stabilityInMilliseconds: expectedDelayInSeconds * 1000,
    });

    // Then request should be recorded
    const requests = p.getRecordedRequestsTo('/foobar');
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(requests[0]);
    const sentRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    expect(sentRequest.url).toContain('?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(sentRequest.response!.payload).toMatchObject(responseBody);

    // And button should be enabled
    await p.hover(checkbox).expectThat(checkbox).isEnabled().check(checkbox);

    // When I close the browser
    await p.close();

    // then the HAR data should tell that request has lasted 10s
    const harData = p.getRecordedNetworkActivity();

    const foobarRequest = harData.log.entries.find((entry) =>
      entry.request.url.includes('/foobar?foo=bar'),
    );
    const startTime = new Date(foobarRequest?.startedDateTime || new Date());
    const responseHeaderDate = foobarRequest?.response.headers.find(
      (header) => header.name.toLowerCase() === 'date',
    );
    const endTime = new Date(responseHeaderDate?.value || new Date());

    const elapsedInMilliseconds = endTime.getTime() - startTime.getTime();
    expect(Math.abs(elapsedInMilliseconds - expectedDelayInSeconds * 1000)).toBeLessThan(1000);
  });
});
