import { getAttributeOfHandle } from '../get-attribute-of-handle';
import { ElementHandle } from 'playwright';

export async function hasHandlePlaceholder(
  handle: ElementHandle<Element> | undefined | null,
  expectedPlaceholder: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const placeholder = await getAttributeOfHandle('placeholder', handle);

  return placeholder === expectedPlaceholder;
}
