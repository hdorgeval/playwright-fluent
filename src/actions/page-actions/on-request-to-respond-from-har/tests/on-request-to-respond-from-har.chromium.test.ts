import * as SUT from '../index';
import { recordRequestsTo } from '../../record-requests-to';
import { stringifyRequest, RequestInfo, sleep } from '../../../../utils';
import { defaultHarRequestResponseOptions, HarRequestResponseOptions } from '../index';
import { Browser, chromium, Request } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('on request to respond from HAR files', (): void => {
  let browser: Browser | undefined = undefined;
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
    jest.setTimeout(120000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should mock response from HAR file', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    const responseBody = {
      prop1: 'foobar',
    };
    const mockResponseBody = {
      prop1: 'mock-foobar',
    };
    const harResponseBody = {
      prop1: 'mocked-prop1',
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

    const htmlContent = readFileSync(
      `${path.join(__dirname, 'on-request-to-respond-from-har.test.html')}`,
    );
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/app')
        .willReturn(htmlContent.toString(), 200);

    const requests: Request[] = [];
    const takeAllPredicate = () => false;
    const callback = (request: Request) => requests.push(request);
    await recordRequestsTo('/foobar', takeAllPredicate, page, callback);

    const harFile = path.join(__dirname, 'on-request-to-respond-with.har');
    const harFiles = [harFile];
    const foundUrls: string[] = [];
    const notFoundUrls: string[] = [];
    const options: HarRequestResponseOptions = {
      ...defaultHarRequestResponseOptions,
      onHarEntryFound: (_foundEntry, requestedUrl, requestedMethod) => {
        foundUrls.push(`found entry for url : '${requestedMethod}' ${requestedUrl}`);
      },
      onHarEntryNotFound: (_allEntries, requestedUrl, requestedMethod) => {
        notFoundUrls.push(`not found entry for url :  '${requestedMethod}' ${requestedUrl}`);
      },
    };
    // When
    await SUT.onRequestToRespondFromHar('/foobar', harFiles, page, options);

    await page.goto('http://localhost:1234/app');
    await sleep(3000);

    // Then
    expect(requests.length).toBe(1);
    const stringifiedRequest = await stringifyRequest(requests[0]);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;

    expect(request.url).toContain('?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.payload).not.toMatchObject(responseBody);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.payload).not.toMatchObject(mockResponseBody);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.payload).toMatchObject(harResponseBody);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.headers['foo-header']).toBe('har-bar');
  });
});
