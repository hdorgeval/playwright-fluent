import * as path from 'path';
import { Browser, chromium, Request } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as SUT from '../index';
import { stringifyRequest, RequestInfo, sleep } from '../../../../utils';

describe('record requests to', (): void => {
  let browser: Browser | undefined = undefined;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1239);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1239
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should record successufull requests', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
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

    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);
    const takeAllPredicate = () => false;

    // When
    await SUT.recordRequestsTo('/foobar', takeAllPredicate, page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-requests-to.test.html')}`);
    await sleep(3000);

    // Then
    expect(requests.length).toBe(1);

    const stringifiedRequest = await stringifyRequest(requests[0]);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;

    expect(request.url).toContain('?foo=bar');

    expect(request.response!.status).toBe(200);

    expect(await request.response!.payload).toMatchObject(responseBody);
  });

  test('should record failed requests 500', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);
    const takeAllPredicate = () => false;

    // When
    await SUT.recordRequestsTo('/500', takeAllPredicate, page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`);
    await sleep(3000);

    // Then
    expect(requests.length).toBe(1);

    const stringifiedRequest = await stringifyRequest(requests[0]);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;
    expect(request.response!.status).toBe(500);

    expect(request.response!.statusText).toBe('Internal Server Error');
  });

  test('should encode HTML response', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);
    const takeAllPredicate = () => false;

    // When
    await SUT.recordRequestsTo('/', takeAllPredicate, page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-requests-to.test.html')}`);
    await sleep(3000);

    // Then
    const htmlPageRequest = requests[0];
    const stringifiedRequest = await stringifyRequest(htmlPageRequest);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;
    expect(request.response!.payload).not.toContain('<script>');

    expect(request.response!.payload).toContain('&lt;script&gt;');
  });

  test('should record postdata on failed POST requests 502', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .post()
        .to('/502')
        .willFail(502);

    const requests: Request[] = [];
    const callback = (request: Request) => requests.push(request);
    const takeAllPredicate = () => false;

    // When
    await SUT.recordRequestsTo('/502', takeAllPredicate, page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-502.test.html')}`);
    await sleep(3000);

    // Then
    expect(requests.length).toBe(1);

    const stringifiedRequest = await stringifyRequest(requests[0]);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;
    expect(request.response!.status).toBe(502);
    expect(request.postData).toMatchObject({ foo: 'bar' });

    expect(request.response!.statusText).toBe('Bad Gateway');
  });
});
