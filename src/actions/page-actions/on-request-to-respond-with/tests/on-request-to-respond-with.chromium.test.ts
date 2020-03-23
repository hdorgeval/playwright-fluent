import * as SUT from '../index';
import { recordRequestsTo, Request } from '../../record-requests-to';
import { stringifyRequest, RequestInfo } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

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
    jest.setTimeout(60000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );

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
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    const requests: Request[] = [];
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const callback = (request: Request) => requests.push(request);
    await recordRequestsTo('/foobar', page, callback);

    // When
    await SUT.onRequestToRespondWith(
      '/foobar',
      {
        headers: responseHeaders,
        body: mockResponseBody,
      },
      page,
    );

    await page.goto(`file:${path.join(__dirname, 'on-request-to-respond-with.test.html')}`);
    await page.waitFor(3000);

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
