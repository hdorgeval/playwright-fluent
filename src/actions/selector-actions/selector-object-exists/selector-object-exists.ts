import { Frame, Page } from 'playwright';
import { SelectorFluent } from '../../../selector-api';
import { handleExists } from '../../handle-actions';
import { report, waitUntil, WaitUntilOptions } from '../../../utils';

export async function selectorObjectExists(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector.toString()}' exists because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check that '${selector.toString()}' exists because this selector was not found in DOM`,
    {
      ...options,
      throwOnTimeout: false,
    },
  );

  const handle = await selector.getHandle();
  return await handleExists(handle);
}
