import { WaitUntilOptions, defaultWaitUntilOptions, waitUntil } from '../../utils';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import { Dialog } from 'playwright';

export type DialogType = 'alert' | 'confirm' | 'prompt' | 'beforeunload';

export async function expectThatDialogIsOfType(
  dialog: () => Dialog,
  dialogType: DialogType,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  switch (dialogType) {
    case 'alert':
    case 'beforeunload':
    case 'confirm':
    case 'prompt':
      break;
    default:
      throw new Error(
        `Unknown dialog type: '${dialogType}'. It should be 'alert', 'confirm', 'prompt' or 'beforeunload'`,
      );
  }

  await waitUntil(
    async () => {
      const currentDialog = dialog();
      return currentDialog && currentDialog.type() === dialogType;
    },
    async (): Promise<string> => {
      const currentDialog = dialog();
      if (!currentDialog) {
        return `No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.`;
      }
      return `Current dialog is of type '${currentDialog.type()}' but it should be '${dialogType}'`;
    },
    waitOptions,
  );
}
