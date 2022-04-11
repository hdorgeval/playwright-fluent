import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { isHandleVisibleInViewport } from '../../handle-actions';

export async function isSelectorVisibleInViewport(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get visibility status of '${selector}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await isHandleVisibleInViewport(handle, { verbose: options.verbose });
  return result;
}
