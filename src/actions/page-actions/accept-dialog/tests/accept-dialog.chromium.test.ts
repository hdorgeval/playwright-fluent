import * as path from 'path';
import { Browser, chromium, Dialog } from 'playwright';
import * as SUT from '../index';
import { sleep } from '../../../../utils';
import { recordPageDialogs } from '../../record-page-dialogs';

describe('accept page dialog', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should accept confirm dialog', async (): Promise<void> => {
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
    const onAccepted = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'accept-dialog-confirm.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.acceptDialog(openedDialog, undefined, page, onAccepted);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('confirm');
  });

  test('should accept alert dialog', async (): Promise<void> => {
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
    const onAccepted = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'accept-dialog-alert.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.acceptDialog(openedDialog, undefined, page, onAccepted);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('alert');
  });

  test('should accept prompt dialog', async (): Promise<void> => {
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
    const onAccepted = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'accept-dialog-prompt.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.acceptDialog(openedDialog, undefined, page, onAccepted);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('prompt');
  });

  test('should accept prompt dialog with prompt text', async (): Promise<void> => {
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
    const onAccepted = () => {
      dialogIsOpened = false;
    };

    await recordPageDialogs(page, callback);

    // When
    await page.goto(`file:${path.join(__dirname, 'accept-dialog-prompt.test.html')}`);
    await sleep(3000);

    // Then
    expect(dialogIsOpened).toBe(true);

    // When
    await SUT.acceptDialog(openedDialog, 'foobar', page, onAccepted);

    // Then
    expect(dialogIsOpened).toBe(false);

    expect(openedDialog!.type()).toBe('prompt');
  });
});
