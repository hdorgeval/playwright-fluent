import * as path from 'path';
import { Browser, chromium, Dialog } from 'playwright';
import * as SUT from '../index';
import { sleep } from '../../../../utils';
import { recordPageDialogs } from '../../record-page-dialogs';

describe('cancel page dialog', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should cancel confirm dialog', async (): Promise<void> => {
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
    const onCanceled = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'cancel-dialog-confirm.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.cancelDialog(openedDialog, page, onCanceled);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('confirm');
  });

  test('should cancel alert dialog', async (): Promise<void> => {
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
    const onCanceled = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'cancel-dialog-alert.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.cancelDialog(openedDialog, page, onCanceled);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('alert');
  });

  test('should cancel prompt dialog', async (): Promise<void> => {
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
    const onCanceled = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'cancel-dialog-prompt.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.cancelDialog(openedDialog, page, onCanceled);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('prompt');
  });
});
