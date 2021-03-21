import { HoverOptions, hoverOnHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { Frame, Page } from 'playwright';

export async function hoverOnSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: HoverOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot hover on '${selector}' because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, {
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    throwOnTimeout: true,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
    verbose: options.verbose,
  });

  await hoverOnHandle(handle, selector, page, options);
}
