import { Frame, Page } from 'playwright';
import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { doubleClickOnHandle, DoubleClickOptions } from '../../handle-actions';

export async function doubleClickOnSelectorObject(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: DoubleClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot double-click on '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot double-click on '${selector.toString()}' because this selector was not found in DOM`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const handle = await selector.getHandle();
  await doubleClickOnHandle(handle, selector.toString(), page, options);
}
