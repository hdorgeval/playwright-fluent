import { getClassListOfHandle } from '../get-class-list-of-handle';
import { ElementHandle } from 'playwright';

export async function hasNotHandleClass(
  handle: ElementHandle<Element> | undefined | null,
  expectedClass: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const classList = await getClassListOfHandle(handle);

  if (!Array.isArray(classList)) {
    return true;
  }
  // prettier-ignore
  const hasClass = classList
    .filter((c) => c === expectedClass)
    .length > 0;

  return !hasClass;
}
