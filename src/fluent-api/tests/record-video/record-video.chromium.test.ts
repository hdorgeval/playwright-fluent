import * as path from 'path';
import { FakeServer } from 'simple-fake-server';
import * as SUT from '../../playwright-fluent';
import { sizeOf } from '../../../devices';

describe('Playwright Fluent - recordVideo()', (): void => {
  let p: SUT.PlaywrightFluent;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1247);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1247
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

  test('should record video', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-video.test.html')}`;

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
      .withWindowSize(sizeOf._1024x768)
      .withCursor()
      .clearVideoFilesOlderThan(__dirname, 60)
      .recordVideo({ dir: __dirname, size: sizeOf._1024x768 })
      .navigateTo(url)
      .wait(3000)
      .close();

    // Then video path should be available
    const videoPath = await p.getRecordedVideoPath();
    expect(videoPath).toBeDefined();
  });
});
