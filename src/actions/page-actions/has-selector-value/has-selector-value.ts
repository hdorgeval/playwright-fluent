import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandleValue } from '../../handle-actions';
import { Page } from 'playwright';

export async function hasSelectorValue(
  selector: string,
  expectedValue: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(`Cannot check value of '${selector}' because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandleValue(handle, expectedValue);
  return result;
}
