import * as SUT from '../index';
import { recordRequestsTo, Request } from '../../record-requests-to';
import { stringifyRequest, RequestInfo, sleep } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('delay requests to', (): void => {
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
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        const contexts = browser.contexts();
        await contexts[0].close();
        await browser.close();
      }
    },
  );

  test('should delay request', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({
      viewport: null,
      recordHar: { path: `${path.join(__dirname, 'delay-requests-to.test.har')}` },
    });
    const page = await context.newPage();

    const responseBody = {
      prop1: 'foobar',
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

    const htmlContent = readFileSync(`${path.join(__dirname, 'delay-requests-to.test.html')}`);
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/app')
        .willReturn(htmlContent.toString(), 200);

    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);
    await recordRequestsTo('/foobar', page, callback);

    // When
    await SUT.delayRequestsTo('/foobar', 10, page);

    await page.goto('http://localhost:1234/app');
    await sleep(5000);

    // Then
    expect(requests.length).toBe(0);

    await sleep(10000);
    expect(requests.length).toBe(1);
    const stringifiedRequest = await stringifyRequest(requests[0]);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;

    expect(request.url).toContain('?foo=bar');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.payload).toMatchObject(responseBody);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.headers['foo-header']).toBe('bar');
  });
});
