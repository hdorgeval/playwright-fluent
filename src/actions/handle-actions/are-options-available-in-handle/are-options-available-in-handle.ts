import { ElementHandle } from 'playwright';
import { isOptionAvailableInHandle } from '../is-option-available-in-handle';

export async function areOptionsAvailableInHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
  expectedOptionLabels: string[],
): Promise<boolean> {
  if (expectedOptionLabels.length === 0) {
    throw new Error(
      `Cannot check that options are available in selector '${name}' because no options were provided.`,
    );
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
