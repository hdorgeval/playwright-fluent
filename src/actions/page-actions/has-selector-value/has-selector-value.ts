import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandleValue } from '../../handle-actions';

export async function hasSelectorValue(
  selector: string,
  expectedValue: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(`Cannot check value of '${selector}' because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandleValue(handle, expectedValue);
  return result;
}
