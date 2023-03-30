import * as path from 'path';
import { Browser, chromium } from 'playwright';
import { showMousePosition } from '../../dom-actions';
import * as SUT from '../index';
describe('get current url', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an error - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'get-current-url.test.html')}`;
    await page.goto(url);

    const linkSelector = '#foobar';

    // When I click on a link that opens a new browser tab
    await page.click(linkSelector);
    // And I close the previous browser tab
    await page.close();

    // Then
    const result = await SUT.getCurrentUrl(page);
    const expectedResult = 'Error: page.evaluate: Target page, context or browser has been closed';
    expect(result).toBe(expectedResult);
  });
});
