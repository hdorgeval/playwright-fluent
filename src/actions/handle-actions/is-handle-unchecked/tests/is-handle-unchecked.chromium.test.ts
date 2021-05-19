import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { sleep } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('handle is unchecked', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return false when selector has no checked property', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-unchecked.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('p');
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when checkbox is unchecked', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-unchecked.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const label = await page.$('label[for="switch1"]');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await label!.click();

    const handle = await page.$('#switch1');
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });

  test('should return false when checkbox is checked', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-unchecked.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const handle = await page.$('#switch1');
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });

  test('should return true when radio button is unchecked', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-unchecked.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const label = await page.$('label[for="unchecked-radio"]');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await label!.click();

    const handle = await page.$('#checked-radio');
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(true);
  });
  test('should return false when radio button is checked', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'is-handle-unchecked.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    // When
    const label = await page.$('label[for="unchecked-radio"]');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await label!.click();

    const handle = await page.$('#unchecked-radio');
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(handle).toBeDefined();
    expect(result).toBe(false);
  });
});
