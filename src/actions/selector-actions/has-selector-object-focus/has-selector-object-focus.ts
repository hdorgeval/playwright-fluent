import { Frame, Page } from 'playwright';
import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { hasHandleFocus } from '../../handle-actions';

export async function hasSelectorObjectFocus(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot get the focus state of '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot get the focus state of '${selector.toString()}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await hasHandleFocus(handle);
}
