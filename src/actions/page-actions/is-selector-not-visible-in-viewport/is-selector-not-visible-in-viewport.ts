import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, noWaitNoThrowOptions } from '../../../utils';
import { isHandleNotVisibleInViewport } from '../../handle-actions';

export async function isSelectorNotVisibleInViewport(
  selector: string,
  page: Page | Frame | undefined,
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
  const result = await isHandleNotVisibleInViewport(handle, { verbose: options.verbose });
  return result;
}
