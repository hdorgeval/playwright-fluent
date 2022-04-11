import { Frame, Page } from 'playwright';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandleAriaLabel } from '../../handle-actions';

export async function hasSelectorAriaLabel(
  selector: string,
  expectedAriaLabel: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' has aria-label '${expectedAriaLabel}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandleAriaLabel(handle, expectedAriaLabel);
  return result;
}
