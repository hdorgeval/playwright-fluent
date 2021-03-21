import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { hasNotHandleClass } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function hasNotSelectorObjectClass(
  selector: SelectorFluent,
  expectedClass: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector.toString()}' does not have class '${expectedClass}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check that '${selector.toString()}' does not have class '${expectedClass}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await hasNotHandleClass(handle, expectedClass);
}
