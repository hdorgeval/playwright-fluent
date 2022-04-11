import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { getAttributeOfHandle } from '../../handle-actions';

export async function getAttributeOfSelector(
  selector: string,
  attributeName: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<string | null> {
  if (!page) {
    throw new Error(
      `Error: cannot get the attribute '${attributeName}' of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await getAttributeOfHandle(attributeName, handle);
  return result;
}
