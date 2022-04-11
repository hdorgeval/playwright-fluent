import { ElementHandle } from 'playwright';
import { isOptionByValueAvailableInHandle } from '../is-option-by-value-available-in-handle';

export async function areOptionsByValueAvailableInHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
  expectedOptionValues: string[],
): Promise<boolean> {
  if (expectedOptionValues.length === 0) {
    throw new Error('No option to check: you must specify at least one option');
  }

  for (let index = 0; index < expectedOptionValues.length; index++) {
    const expectedOptionValue = expectedOptionValues[index];
    const isAvailable = await isOptionByValueAvailableInHandle(selector, name, expectedOptionValue);
    if (!isAvailable) {
      return false;
    }
  }

  return true;
}
