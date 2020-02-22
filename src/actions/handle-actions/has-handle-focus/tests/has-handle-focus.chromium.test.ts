import * as SUT from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('handle has focus', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );
  test('should return true when input selector has focus', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-focus.test.html')}`;
    await page.goto(url);

    const input1 = await page.$('#input1');
    const input2 = await page.$('#input2');

    // When
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await input1!.click();
    const input1HasFocus = await SUT.hasHandleFocus(input1);
    const input2HasFocus = await SUT.hasHandleFocus(input2);

    // Then
    expect(input1).toBeDefined();
    expect(input2).toBeDefined();
    expect(input1HasFocus).toBe(true);
    expect(input2HasFocus).toBe(false);
  });

  test('should return true when p selector has focus', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-focus.test.html')}`;
    await page.goto(url);

    const p1 = await page.$('#p1');
    const p2 = await page.$('#p2');

    // When
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await p1!.click();
    let p1HasFocus = await SUT.hasHandleFocus(p1);
    let p2HasFocus = await SUT.hasHandleFocus(p2);

    // Then
    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p1HasFocus).toBe(true);
    expect(p2HasFocus).toBe(false);

    // When
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await p2!.click();
    p1HasFocus = await SUT.hasHandleFocus(p1);
    p2HasFocus = await SUT.hasHandleFocus(p2);

    // Then
    expect(p1HasFocus).toBe(false);
    expect(p2HasFocus).toBe(true);
  });

  test('should return false when selector has not the focus', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(__dirname, 'has-handle-focus.test.html')}`;
    await page.goto(url);

    const input1 = await page.$('#input1');

    // When
    const initialFocus = await SUT.hasHandleFocus(input1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await input1!.click();
    const finalFocus = await SUT.hasHandleFocus(input1);

    // Then
    expect(input1).toBeDefined();
    expect(initialFocus).toBe(false);
    expect(finalFocus).toBe(true);
  });
});
