import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { defaultPasteTextOptions } from '../paste-text';
import { sleep } from '../../../../utils';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('paste text', (): void => {
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

  test('should paste text in a content-editable element that do not have paste event handler - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const selector = '#target';
    await page.click(selector);
    const handle = await page.$(selector);

    // When
    await SUT.pasteText('foobar', page, {
      ...defaultPasteTextOptions,
      handlePasteEvent: true,
    });

    // Then
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle!.evaluate((node) => node.innerHTML)).toBe('foobar');
  });

  test('should paste text in an input element that do not have paste event handler - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const selector = '#targetInput';
    await page.click(selector);
    const handle = await page.$(selector);

    // When
    await SUT.pasteText('foobar', page, {
      ...defaultPasteTextOptions,
      handlePasteEvent: true,
    });

    // Then
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle!.evaluate((node) => (node as HTMLInputElement).value)).toBe('foobar');
  });

  test('should paste text in a content-editable element that have paste event handler - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    await page.goto(url);
    await sleep(1000);

    const selector = '#emptyInput';
    await page.click(selector);

    // When
    await SUT.pasteText('foobar', page, defaultPasteTextOptions);

    // Then
    const handle = await page.$(selector);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(await handle!.evaluate((node) => (node as HTMLInputElement).value)).toBe('FOOBAR');
  });
});
