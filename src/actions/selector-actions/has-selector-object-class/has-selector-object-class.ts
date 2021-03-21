import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { hasHandleClass } from '../../handle-actions';
import { Frame, Page } from 'playwright';

export async function hasSelectorObjectClass(
  selector: SelectorFluent,
  expectedClass: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector.toString()}' has class '${expectedClass}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check that '${selector.toString()}' has class '${expectedClass}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await hasHandleClass(handle, expectedClass);
}
