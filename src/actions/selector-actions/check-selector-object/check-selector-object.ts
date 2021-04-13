import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { CheckOptions, checkHandle } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function checkSelectorObject(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: CheckOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot check '${selector.toString()}' because no browser has been launched`);
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check '${selector.toString()}' because this selector was not found in DOM`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const handle = await selector.getHandle();
  await checkHandle(handle, selector.toString(), page, options);
}
