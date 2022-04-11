import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandlePlaceholder } from '../../handle-actions';

export async function hasSelectorPlaceholder(
  selector: string,
  expectedPlaceholder: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' has placeholder '${expectedPlaceholder}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandlePlaceholder(handle, expectedPlaceholder);
  return result;
}
