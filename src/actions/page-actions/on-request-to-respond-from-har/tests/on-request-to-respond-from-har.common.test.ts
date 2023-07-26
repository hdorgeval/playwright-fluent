import path from 'path';
import { Browser, chromium, Page } from 'playwright';
import * as SUT from '../index';
import { defaultHarRequestResponseOptions } from '../index';

describe('on request to respond from HAR', (): void => {
  let browser: Browser | undefined = undefined;

  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const harFile = path.join(__dirname, 'on-request-to-respond-with.har');
    const harFiles = [harFile];
    // When
    // Then
    const expectedError = new Error(
      "Cannot intercept requests to '/foobar' because no browser has been launched",
    );
    await SUT.onRequestToRespondFromHar(
      '/foobar',
      harFiles,
      page,
      defaultHarRequestResponseOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should return an error when no har file provided', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    // Then
    const expectedError = new Error(
      "Cannot intercept requests to '/foobar' because no HAR file(s) has been provided. You must provide at least one HAR file.",
    );
    await SUT.onRequestToRespondFromHar(
      '/foobar',
      [],
      page,
      defaultHarRequestResponseOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should return an error when har file does not exist', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    // Then
    const expectedError = new Error(
      "File 'foo.har' does not exist. Ensure you have called 'recordNetworkActivity({path: foo.har})' and that you have closed the browser. HAR data is only saved to disk when the browser is closed.",
    );
    await SUT.onRequestToRespondFromHar(
      '/foobar',
      ['foo.har'],
      page,
      defaultHarRequestResponseOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });
});
