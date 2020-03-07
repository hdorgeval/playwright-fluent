import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandleText } from '../../handle-actions';
import { Page } from 'playwright';

export async function hasSelectorText(
  selector: string,
  expectedText: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check inner text of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandleText(handle, expectedText);
  return result;
}
