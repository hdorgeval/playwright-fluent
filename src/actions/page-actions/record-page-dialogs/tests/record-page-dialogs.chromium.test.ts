import * as path from 'path';
import { Browser, chromium, Dialog } from 'playwright';
import * as SUT from '../index';
import { sleep } from '../../../../utils';

describe('record page dialogs', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should record confirm dialog', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    let dialogIsOpened = false;
    let openedDialog: Dialog | undefined = undefined;
    const callback = (dialog: Dialog) => {
      dialogIsOpened = true;
      openedDialog = dialog;
    };

    // When
    await SUT.recordPageDialogs(page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-page-dialogs-confirm.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    expect(openedDialog!.type()).toBe('confirm');
  });

  test('should record alert dialog', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    let dialogIsOpened = false;
    let openedDialog: Dialog | undefined = undefined;
    const callback = (dialog: Dialog) => {
      dialogIsOpened = true;
      openedDialog = dialog;
    };

    // When
    await SUT.recordPageDialogs(page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-page-dialogs-alert.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    expect(openedDialog!.type()).toBe('alert');
  });

  test('should record prompt dialog', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    let dialogIsOpened = false;
    let openedDialog: Dialog | undefined = undefined;
    const callback = (dialog: Dialog) => {
      dialogIsOpened = true;
      openedDialog = dialog;
    };

    // When
    await SUT.recordPageDialogs(page, callback);
    await page.goto(`file:${path.join(__dirname, 'record-page-dialogs-prompt.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    expect(openedDialog!.type()).toBe('prompt');
  });
});
