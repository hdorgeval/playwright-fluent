import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { getAllOptionsOfHandle, SelectOptionInfo } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function getAllOptionsOfSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<SelectOptionInfo[]> {
  if (!page) {
    throw new Error(
      `Error: cannot get options of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await getAllOptionsOfHandle(handle, selector);
  return result;
}
