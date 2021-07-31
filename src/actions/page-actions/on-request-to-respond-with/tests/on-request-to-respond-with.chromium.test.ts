import * as SUT from '../index';
import { recordRequestsTo } from '../../record-requests-to';
import { stringifyRequest, RequestInfo, sleep } from '../../../../utils';
import { Browser, chromium, Request } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('on request to respond with', (): void => {
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

  test('should mock response', async (): Promise<void> => {
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
      `${path.join(__dirname, 'on-request-to-respond-with.test.html')}`,
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

    // When
    await SUT.onRequestToRespondWith(
      '/foobar',
      { method: 'GET', bypassPredicate: () => false },
      {
        headers: responseHeaders,
        body: mockResponseBody,
      },
      page,
    );

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
    expect(request.response!.payload).toMatchObject(mockResponseBody);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.headers['foo-header']).toBe('bar');
  });
});
