import { CheckOptions, checkHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, defaultWaitUntilOptions } from '../../../utils';
import { Frame, Page } from 'playwright';

export async function checkSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: CheckOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot check '${selector}' because no browser has been launched`);
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, page, waitOptions);
  await checkHandle(handle, selector, page, options);
}
