import { WaitUntilOptions } from '../../../utils';
import { doNotGetHandleOf } from '../do-not-get-handle-of';
import { Frame, Page } from 'playwright';

export async function selectorDoesNotExist(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' does not exist because no browser has been launched`,
    );
  }

  const handle = await doNotGetHandleOf(selector, page, options);
  return handle === null;
}
