import * as SUT from '../index';
import { Request } from '../../record-requests-to';
import { stringifyRequest, RequestInfo, sleep } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

describe('record failed requests', (): void => {
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

  test('should record HTP 500 requests', async (): Promise<void> => {
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

    // When
    await SUT.recordFailedRequests(page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`);
    await sleep(3000);

    // Then
    expect(requests.length).toBe(1);

    const stringifiedRequest = await stringifyRequest(requests[0]);
    const request = JSON.parse(stringifiedRequest) as RequestInfo;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(request.response!.statusText).toBe('Internal Server Error');
  });
});
