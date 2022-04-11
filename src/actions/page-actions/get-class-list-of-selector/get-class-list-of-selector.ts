import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { getClassListOfHandle } from '../../handle-actions/get-class-list-of-handle';

export async function getClassListOfSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<string[]> {
  if (!page) {
    throw new Error(
      `Error: cannot get the class list of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await getClassListOfHandle(handle);
  return result;
}
