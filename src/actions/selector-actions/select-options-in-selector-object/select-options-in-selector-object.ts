import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { SelectOptions, selectOptionsInHandle } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function selectOptionsInSelectorObject(
  selector: SelectorFluent,
  labels: string[],
  page: Page | Frame | undefined,
  options: SelectOptions,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot select options '${labels}' in '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot select options '${labels}' in '${selector.toString()}' because this selector was not found in DOM`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const handle = await selector.getHandle();
  await selectOptionsInHandle(handle, selector.toString(), labels, page, options);
}
