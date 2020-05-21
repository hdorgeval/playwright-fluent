import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasNotHandleClass } from '../../handle-actions/has-not-handle-class';
import { Page } from 'playwright';

export async function hasNotSelectorClass(
  selector: string,
  expectedClass: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' does not have class '${expectedClass}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasNotHandleClass(handle, expectedClass);
  return result;
}
