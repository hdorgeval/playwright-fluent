import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { hasHandleAttribute } from '../../handle-actions';
import { Page } from 'playwright';

export async function hasSelectorObjectAttribute(
  selector: SelectorFluent,
  attributeName: string,
  expectedAttributeValue: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector.toString()}' has attribute '${attributeName}' with value '${expectedAttributeValue}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot check that '${selector.toString()}' has attribute '${attributeName}' with value '${expectedAttributeValue}' because this selector was not found in DOM`,
    options,
  );

  const handle = await selector.getHandle();
  return await hasHandleAttribute(handle, attributeName, expectedAttributeValue);
}
