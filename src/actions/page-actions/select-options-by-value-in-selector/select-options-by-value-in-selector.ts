import { Frame, Page } from 'playwright';
import { SelectOptions, selectOptionsByValueInHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, defaultWaitUntilOptions } from '../../../utils';

export async function selectOptionsByValueInSelector(
  selector: string,
  values: string[],
  page: Page | Frame | undefined,
  options: SelectOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot select options '${values}' because no browser has been launched`);
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, page, waitOptions);
  await selectOptionsByValueInHandle(handle, selector, values, page, options);
}
