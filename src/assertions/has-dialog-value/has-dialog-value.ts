import { WaitUntilOptions, defaultWaitUntilOptions, waitUntil } from '../../utils';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import { Dialog } from 'playwright';
export async function expectThatDialogHasValue(
  dialog: () => Dialog | undefined,
  value: string,
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
      const currentValue = currentDialog?.defaultValue();
      if (typeof currentValue !== 'string') {
        return false;
      }

      if (currentValue.length === 0) {
        return value === '';
      }

      return currentValue.includes(value);
    },
    async (): Promise<string> => {
      const currentDialog = dialog();
      if (!currentDialog) {
        return `No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.`;
      }
      return `Current dialog has value '${currentDialog.defaultValue()}' but it should be '${value}'`;
    },
    waitOptions,
  );
}
