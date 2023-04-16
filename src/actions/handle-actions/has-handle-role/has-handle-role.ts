import { ElementHandle } from 'playwright';
import { getAttributeOfHandle } from '../get-attribute-of-handle';

export async function hasHandleRole(
  handle: ElementHandle<Element> | undefined | null,
  expectedRole: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const label = await getAttributeOfHandle('role', handle);

  return label === expectedRole;
}
