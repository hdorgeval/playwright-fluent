import { Frame, Page } from 'playwright';
import { HoverOptions, hoverOnHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';

export async function hoverOnSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: HoverOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot hover on '${selector}' because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, {
    ...options,
    throwOnTimeout: true,
    wrapPredicateExecutionInsideTryCatch: true,
  });

  await hoverOnHandle(handle, selector, page, options);
}
