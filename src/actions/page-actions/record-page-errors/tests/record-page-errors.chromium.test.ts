import * as path from 'path';
import { Browser, chromium } from 'playwright';
import { FakeServer } from 'simple-fake-server';
import * as SUT from '../index';
import { sleep } from '../../../../utils';

describe('record page errors', (): void => {
  let browser: Browser | undefined = undefined;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1238);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1238
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should record page errors', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    const errors: Error[] = [];
    const callback = (request: Error) => errors.push(request);

    // When
    await SUT.recordPageErrors(page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-page-errors.test.html')}`);
    await sleep(3000);

    // Then
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain('Oops');
  });
});
