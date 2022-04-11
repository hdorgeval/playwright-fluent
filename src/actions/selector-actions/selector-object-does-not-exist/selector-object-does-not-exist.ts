import { Frame, Page } from 'playwright';
import { SelectorFluent } from '../../../selector-api';
import { report, waitUntil, WaitUntilOptions } from '../../../utils';

export async function selectorObjectDoesNotExist(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector.toString()}' does not exist because no browser has been launched`,
    );
  }

  report('waiting for the selector to be removed from DOM ...', options.verbose);
  await waitUntil(() => selector.doesNotExist(), `'${selector.toString()}' was not found in DOM`, {
    ...options,
    throwOnTimeout: false,
  });

  return await selector.doesNotExist();
}
