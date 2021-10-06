import { Dialog, Frame, Page } from 'playwright';

export async function cancelDialog(
  dialog: Dialog | undefined,
  page: Page | Frame | undefined,
  onCanceled: () => Promise<void> | void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot cancel dialog because no browser has been launched`);
  }

  if (!dialog) {
    throw new Error(`Cannot cancel dialog because no dialog has been opened`);
  }

  await dialog.dismiss();
  await onCanceled();
}
