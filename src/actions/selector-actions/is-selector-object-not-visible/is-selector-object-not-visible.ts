import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector';
import { isHandleVisible, isHandleNotVisible } from '../../handle-actions';
import { Page } from 'playwright';

export async function isSelectorObjectNotVisible(
  selector: SelectorFluent,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get visibility status of '${selector.toString()}' because no browser has been launched`,
    );
  }

  const isVisible = await isHandleVisible(await selector.getHandle(), { verbose: options.verbose });
  if (isVisible) {
    report('waiting for the selector to disappear ...', options.verbose);
    await waitUntil(() => selector.isNotVisible(), `'${selector.toString()}' is visible.`, options);
  }

  const handle = await selector.getHandle();
  return await isHandleNotVisible(handle, { verbose: options.verbose });
}
