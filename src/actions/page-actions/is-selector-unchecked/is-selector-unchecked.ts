import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { isHandleUnchecked } from '../../handle-actions';
import { Page } from 'playwright';

export async function isSelectorUnchecked(
  selector: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get checked status of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await isHandleUnchecked(handle, { verbose: options.verbose });
  return result;
}
