import { Dialog } from 'playwright';
import { WaitUntilOptions, defaultWaitUntilOptions, waitUntil } from '../../utils';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
export async function expectThatDialogHasMessage(
  dialog: () => Dialog | undefined,
  message: string,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    async () => {
      const currentDialog = dialog();
      const currentMessage = currentDialog?.message();
      if (typeof currentMessage !== 'string') {
        return false;
      }

      return currentMessage.includes(message);
    },
    async (): Promise<string> => {
      const currentDialog = dialog();
      if (!currentDialog) {
        return `No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.`;
      }
      return `Current dialog has message '${currentDialog.message()}' but it should be '${message}'`;
    },
    waitOptions,
  );
}
