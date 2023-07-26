import * as path from 'path';
import { chromium, Dialog } from 'playwright';
import * as SUT from '../index';
import { recordPageDialogs } from '../../record-page-dialogs';

describe('wait for page dialog to open', (): void => {
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {});

  test('should wait for confirm dialog to open', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    let dialogIsOpened = false;
    let openedDialog: Dialog | undefined = undefined;
    const callback = (dialog: Dialog) => {
      dialogIsOpened = true;
      openedDialog = dialog;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'wait-for-dialog-confirm.test.html')}`);
    await SUT.waitForDialog(() => openedDialog, page);

    // Then
    expect(dialogIsOpened).toBe(true);

    expect(openedDialog!.type()).toBe('confirm');
    await browser.close();
  });

  test('should wait for alert dialog to open', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    let dialogIsOpened = false;
    let openedDialog: Dialog | undefined = undefined;
    const callback = (dialog: Dialog) => {
      dialogIsOpened = true;
      openedDialog = dialog;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'wait-for-dialog-alert.test.html')}`);
    await SUT.waitForDialog(() => openedDialog, page);

    // Then
    expect(dialogIsOpened).toBe(true);

    expect(openedDialog!.type()).toBe('alert');
    await browser.close();
  });

  test('should wait for prompt dialog to open', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();
    let dialogIsOpened = false;
    let openedDialog: Dialog | undefined = undefined;
    const callback = (dialog: Dialog) => {
      dialogIsOpened = true;
      openedDialog = dialog;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'wait-for-dialog-prompt.test.html')}`);
    await SUT.waitForDialog(() => openedDialog, page);

    // Then
    expect(dialogIsOpened).toBe(true);

    expect(openedDialog!.type()).toBe('prompt');
    await browser.close();
  });
});
