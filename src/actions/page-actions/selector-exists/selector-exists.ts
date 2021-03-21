import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { handleExists } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function selectorExists(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(`Cannot check that '${selector}' exists because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await handleExists(handle);
  return result;
}
