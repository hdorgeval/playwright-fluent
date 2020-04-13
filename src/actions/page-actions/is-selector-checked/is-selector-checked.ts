import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { isHandleChecked } from '../../handle-actions';
import { Page } from 'playwright';

export async function isSelectorChecked(
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
  const result = await isHandleChecked(handle, { verbose: options.verbose });
  return result;
}
