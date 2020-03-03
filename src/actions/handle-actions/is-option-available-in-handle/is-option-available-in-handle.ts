import { getAllOptionsOfHandle } from '../get-all-options-of-handle';
import { ElementHandle } from 'playwright';

export async function isOptionAvailableInHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
  expectedOptionLabel: string,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const availableOptions = await getAllOptionsOfHandle(selector, name);
  const foundOption = availableOptions
    .filter((option) => option.label === expectedOptionLabel)
    .shift();

  if (foundOption) {
    return true;
  }
  return false;
}
