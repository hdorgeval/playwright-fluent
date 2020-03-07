import { getInnerTextOfHandle } from '../get-inner-text-of-handle';
import { ElementHandle } from 'playwright';

export async function hasHandleText(
  handle: ElementHandle<Element> | undefined | null,
  expectedText: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const text = await getInnerTextOfHandle(handle);

  if (text === undefined && expectedText === '') {
    return true;
  }

  if (text === null && expectedText === '') {
    return true;
  }

  if (text === undefined || text === null) {
    return false;
  }

  if (text === '' && expectedText === '') {
    return true;
  }

  if (expectedText === '') {
    return false;
  }

  if (text.includes(expectedText)) {
    return true;
  }

  return false;
}
