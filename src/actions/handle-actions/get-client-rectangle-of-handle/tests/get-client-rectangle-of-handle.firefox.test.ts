import * as path from 'path';
import { Browser, firefox } from 'playwright';
import * as SUT from '../index';
import { sleep } from '../../../../utils';
import { SerializableDOMRect } from '../../../dom-actions';

// TODO: re-enable these tests on v1.0.0
describe.skip('get client rectangle of an element handle', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return Client Rectangle - firefox', async (): Promise<void> => {
    // Given
    browser = await firefox.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'get-client-rectangle-of-handle.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#foo');
    const result = await SUT.getClientRectangleOfHandle(handle);

    // Then
    const expectedClientRectangle: SerializableDOMRect = {
      bottom: 32,
      height: 21,
      left: 12,
      right: 32,
      top: 11,
      width: 20,
      x: 12, // left
      y: 11, // top
    };
    expect(result).not.toBe(null);
    expect(result).toMatchObject(expectedClientRectangle);
  });
});
