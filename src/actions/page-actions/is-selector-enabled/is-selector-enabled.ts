import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { isHandleEnabled } from '../../handle-actions';
import { Page } from 'playwright';

export async function isSelectorEnabled(
  selector: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get enabled status of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await isHandleEnabled(handle, { verbose: options.verbose });
  return result;
}
