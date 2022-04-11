import { ElementHandle } from 'playwright';
import { getValueOfHandle } from '../get-value-of-handle';

export async function hasHandleValue(
  handle: ElementHandle<Element> | undefined | null,
  expectedValue: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const value = await getValueOfHandle(handle);

  if (value === undefined && expectedValue === '') {
    return true;
  }

  if (value === null && expectedValue === '') {
    return true;
  }

  if (value === undefined || value === null) {
    return false;
  }

  if (value === '' && expectedValue === '') {
    return true;
  }

  if (expectedValue === '') {
    return false;
  }

  if (value.includes(expectedValue)) {
    return true;
  }

  return false;
}
