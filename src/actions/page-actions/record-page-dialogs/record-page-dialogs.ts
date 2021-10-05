import { Dialog, Page } from 'playwright';

export async function recordPageDialogs(
  page: Page | undefined,
  callback: (dialog: Dialog) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot record page dialogs because no browser has been launched`);
  }

  page.on('dialog', (dialog) => {
    callback(dialog);
  });
}
