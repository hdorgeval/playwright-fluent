import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { isHandleReadOnly } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function isSelectorObjectReadOnly(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get readOnly status of '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot get readOnly status of '${selector.toString()}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  const result = await isHandleReadOnly(handle, { verbose: options.verbose });
  return result;
}
