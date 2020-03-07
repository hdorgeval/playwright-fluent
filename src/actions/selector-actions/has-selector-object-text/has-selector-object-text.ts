import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { hasHandleText } from '../../handle-actions';
import { Page } from 'playwright';

export async function hasSelectorObjectText(
  selector: SelectorFluent,
  expectedText: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check inner text of '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check inner text of '${selector.toString()}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await hasHandleText(handle, expectedText);
}
