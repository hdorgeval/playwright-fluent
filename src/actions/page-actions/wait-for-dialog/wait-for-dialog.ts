import {
  defaultWaitUntilOptions,
  waitUntil,
  WaitUntilOptions,
} from '../../../utils/wait-until/wait-until';
import { Dialog, Frame, Page } from 'playwright';

export async function waitForDialog(
  dialog: () => Dialog | undefined,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot wait for a dialog to open because no browser has been launched`);
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  await waitUntil(
    async () => {
      const currentDialog = dialog();
      if (!currentDialog) {
        return false;
      }
      return true;
    },
    `No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.`,
    waitOptions,
  );
}
