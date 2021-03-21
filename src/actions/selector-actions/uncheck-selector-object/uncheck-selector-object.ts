import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { CheckOptions, uncheckHandle } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function uncheckSelectorObject(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: CheckOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot uncheck '${selector.toString()}' because no browser has been launched`);
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot uncheck '${selector.toString()}' because this selector was not found in DOM`,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
      stabilityInMilliseconds: options.stabilityInMilliseconds,
      throwOnTimeout: true,
      verbose: options.verbose,
    },
  );

  const handle = await selector.getHandle();
  await uncheckHandle(handle, selector.toString(), page, options);
}
