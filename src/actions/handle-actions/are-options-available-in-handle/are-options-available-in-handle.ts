import { isOptionAvailableInHandle } from '../is-option-available-in-handle';
import { ElementHandle } from 'playwright';

export async function areOptionsAvailableInHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
  expectedOptionLabels: string[],
): Promise<boolean> {
  if (expectedOptionLabels.length === 0) {
    throw new Error('No option to check: you must specify at least one option');
  }

  for (let index = 0; index < expectedOptionLabels.length; index++) {
    const expectedOptionLabel = expectedOptionLabels[index];
    const isAvailable = await isOptionAvailableInHandle(selector, name, expectedOptionLabel);
    if (!isAvailable) {
      return false;
    }
  }

  return true;
}
