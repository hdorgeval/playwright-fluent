import * as SUT from '../index';
import { recordRequestsTo } from '../../record-requests-to';
import { stringifyRequest, RequestInfo, sleep } from '../../../../utils';
import { Browser, chromium, Request } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';
import { readFileSync } from 'fs';

describe('with mocks', (): void => {
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

  test('should mock response for GET requests', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    const responseBody = {
      prop1: 'foobar',
    };
    const responseHeaders = {
      'foo-header': 'bar',
    };

    const mockResponseBody = {
      prop1: 'mock-foobar',
    };
    const mockResponseHeaders = {
      'foo-header': 'mock-bar',
    };
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/foobar')
        .willReturn(responseBody, 200, responseHeaders);

    const mock: Partial<SUT.FluentMock> = {
      displayName: 'mock for GET /foobar?foo=bar',
      urlMatcher: (url) => url.includes('/foobar'),
      queryStringMatcher: (queryString) => queryString.foo === 'bar',
      methodMatcher: (method) => method === 'GET',
      enrichResponseHeaders: (headers) => {
        return {
          ...headers,
          ...mockResponseHeaders,
        };
      },
      jsonResponse: () => mockResponseBody,
      status: 200,
    };

    const mockOptions: SUT.WithMocksOptions = {
      onMockFound: (foundMock) => {
        expect(foundMock.displayName).toBe(mock.displayName);
      },
      onMockNotFound: (requestInfo) => {
        // eslint-disable-next-line no-console
        console.log(`mock not found for ${requestInfo.request.url()}`);
      },
      onInternalError: (error) => {
        // eslint-disable-next-line no-console
        console.log(`internal error: ${error}`);
      },
    };
    const htmlContent = readFileSync(`${path.join(__dirname, 'with-mocks.test.html')}`);
    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/app')
        .willReturn(htmlContent.toString(), 200);

    const requests: Request[] = [];
    const ignorePredicate = () => false;
    const callback = (request: Request) => requests.push(request);
    await recordRequestsTo('/foobar', ignorePredicate, page, callback);

    const mocks = () => [mock];
    const sharedContext = {};

    // When
    await SUT.withMocks(mocks, () => sharedContext, mockOptions, page);

    await page.goto('http://localhost:1234/app');
    await sleep(3000);

    // Then
    expect(requests.length).toBe(2);
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
    expect(request.response!.headers['foo-header']).toBe('mock-bar');
  });
});
