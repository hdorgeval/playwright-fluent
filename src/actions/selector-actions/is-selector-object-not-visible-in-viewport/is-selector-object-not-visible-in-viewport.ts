import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { isHandleNotVisibleInViewport, isHandleVisibleInViewport } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function isSelectorObjectNotVisibleInViewport(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get visibility status of '${selector.toString()}' because no browser has been launched`,
    );
  }

  const isVisible = await isHandleVisibleInViewport(await selector.getHandle(), {
    verbose: options.verbose,
  });
  if (isVisible) {
    report('waiting for the selector to disappear from the current viewport ...', options.verbose);
    await waitUntil(
      () => selector.isNotVisibleInViewport(),
      `'${selector.toString()}' is visible in the current viewport.`,
      options,
    );
  }

  const handle = await selector.getHandle();
  return await isHandleNotVisibleInViewport(handle, { verbose: options.verbose });
}
