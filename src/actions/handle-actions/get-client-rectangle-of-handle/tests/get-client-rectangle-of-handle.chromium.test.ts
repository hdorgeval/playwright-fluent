import * as SUT from '../index';
import { sleep } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('get client rectangle of an element handle', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return Client Rectangle - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-client-rectangle-of-handle.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#foo');
    const result = await SUT.getClientRectangleOfHandle(handle);

    // Then
    const expectedClientRectangle: ClientRect = {
      bottom: 32,
      height: 21,
      left: 12,
      right: 32,
      top: 11,
      width: 20,
    };
    expect(result).not.toBe(null);
    expect(result).toMatchObject(expectedClientRectangle);
  });
});
