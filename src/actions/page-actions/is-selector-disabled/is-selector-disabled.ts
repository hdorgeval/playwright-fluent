import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { isHandleDisabled, isHandleReadOnly } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function isSelectorDisabled(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get disabled status of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const isDisabled = await isHandleDisabled(handle, { verbose: options.verbose });
  const isReadOnly = await isHandleReadOnly(handle, { verbose: options.verbose });
  const result = isDisabled || isReadOnly;
  return result;
}
