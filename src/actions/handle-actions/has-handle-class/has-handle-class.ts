import { ElementHandle } from 'playwright';
import { getClassListOfHandle } from '../get-class-list-of-handle';

export async function hasHandleClass(
  handle: ElementHandle<Element> | undefined | null,
  expectedClass: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const classList = await getClassListOfHandle(handle);

  if (!Array.isArray(classList)) {
    return false;
  }
  // prettier-ignore
  const hasClass = classList
    .filter((c) => c === expectedClass)
    .length > 0;

  return hasClass;
}
