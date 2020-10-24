import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions } from '../../../utils';
import { hasHandleAttribute } from '../../handle-actions';
import { Page } from 'playwright';

export async function hasSelectorAttribute(
  selector: string,
  attributeName: string,
  expectedAttributeValue: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' has attribute '${attributeName}' with value '${expectedAttributeValue}' because no browser has been launched`,
    );
  }

  const handle = await getHandleOf(selector, page, options);
  const result = await hasHandleAttribute(handle, attributeName, expectedAttributeValue);
  return result;
}
