import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorController } from '../../../selector';
import { isHandleDisabled } from '../../handle-actions';
import { Page } from 'playwright';

export async function isSelectorObjectDisabled(
  selector: SelectorController,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get disabled status of '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot get disabled status of '${selector.toString()}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await isHandleDisabled(handle, { verbose: options.verbose });
}
