import { Frame, Page } from 'playwright';
import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { isHandleDisabled, isHandleReadOnly } from '../../handle-actions';

export async function isSelectorObjectDisabled(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
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
  const isDisabled = await isHandleDisabled(handle, { verbose: options.verbose });
  const isReadOnly = await isHandleReadOnly(handle, { verbose: options.verbose });
  const result = isDisabled || isReadOnly;
  return result;
}
