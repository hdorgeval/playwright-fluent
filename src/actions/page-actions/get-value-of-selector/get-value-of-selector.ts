import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { getValueOfHandle } from '../../handle-actions';

export async function getValueOfSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<string | undefined | null> {
  if (!page) {
    throw new Error(
      `Error: cannot get the value of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await getValueOfHandle(handle);
  return result;
}
