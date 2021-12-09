import * as SUT from '../../playwright-fluent';
import { uniqueFilename } from '../../../utils';
import { FakeServer } from 'simple-fake-server';
import * as path from 'path';

describe('Playwright Fluent - recordNetworkActivity()', (): void => {
  let p: SUT.PlaywrightFluent;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1245);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1245
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should record network activity', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-network-activity.test.html')}`;
    const harFilepath = `${path.join(
      __dirname,
      uniqueFilename({ prefix: 'har-', extension: '.json' }),
    )}`;

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

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordNetworkActivity({ path: harFilepath })
      .recordRequestsTo('/foobar')
      .recordRequestsTo('/yo')
      .navigateTo(url)
      .wait(3000)
      .close();

    // Then HAR can be read
    const har = p.getRecordedNetworkActivity();
    expect(har).toBeDefined();
    expect(har.log.entries.length).toBe(4);
    expect(har.log.entries.find((entry) => entry.request.url.includes('/foobar'))).toBeDefined();
    expect(har.log.entries.find((entry) => entry.request.url.includes('/yo'))).toBeDefined();
  });
});
