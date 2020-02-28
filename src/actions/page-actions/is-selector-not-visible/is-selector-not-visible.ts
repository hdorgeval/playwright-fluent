import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, noWaitNoThrowOptions } from '../../../utils';
import { isHandleNotVisible } from '../../handle-actions';
import { Page } from 'playwright';

export async function isSelectorNotVisible(
  selector: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get visibility status of '${selector}' because no browser has been launched`,
    );
  }
  const waitOptions: WaitUntilOptions = {
    ...options,
    ...noWaitNoThrowOptions,
  };
  const handle = await getHandleOf(selector, page, waitOptions);
  const result = await isHandleNotVisible(handle, { verbose: options.verbose });
  return result;
}
