import { Dialog, Frame, Page } from 'playwright';

export async function acceptDialog(
  dialog: Dialog | undefined,
  promptText: string | undefined,
  page: Page | Frame | undefined,
  onAccepted: () => Promise<void> | void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot accept dialog because no browser has been launched`);
  }

  if (!dialog) {
    throw new Error(`Cannot accept dialog because no dialog has been opened`);
  }

  await dialog.accept(promptText);
  await onAccepted();
}
