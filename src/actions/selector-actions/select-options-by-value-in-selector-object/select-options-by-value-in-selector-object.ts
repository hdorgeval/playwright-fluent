import { Frame, Page } from 'playwright';
import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { SelectOptions, selectOptionsByValueInHandle } from '../../handle-actions';

export async function selectOptionsByValueInSelectorObject(
  selector: SelectorFluent,
  values: string[],
  page: Page | Frame | undefined,
  options: SelectOptions,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot select options '${values}' in '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot select options '${values}' in '${selector.toString()}' because this selector was not found in DOM`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const handle = await selector.getHandle();
  await selectOptionsByValueInHandle(handle, selector.toString(), values, page, options);
}
