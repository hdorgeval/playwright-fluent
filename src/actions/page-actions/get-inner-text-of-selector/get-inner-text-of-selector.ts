import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { getInnerTextOfHandle } from '../../handle-actions';

export async function getInnerTextOfSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<string | null | undefined> {
  if (!page) {
    throw new Error(`Cannot get inner text of '${selector}' because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await getInnerTextOfHandle(handle);
  return result;
}
