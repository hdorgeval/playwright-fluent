import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandleClass } from '../../handle-actions/has-handle-class';
import { Page } from 'playwright';

export async function hasSelectorClass(
  selector: string,
  expectedClass: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' has class '${expectedClass}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandleClass(handle, expectedClass);
  return result;
}
