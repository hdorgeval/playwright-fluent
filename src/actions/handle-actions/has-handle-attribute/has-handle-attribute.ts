import { getAttributeOfHandle } from '../get-attribute-of-handle';
import { ElementHandle } from 'playwright';

export async function hasHandleAttribute(
  handle: ElementHandle<Element> | undefined | null,
  attributeName: string,
  expectedAttributeValue: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const attributeValue = await getAttributeOfHandle(attributeName, handle);

  return attributeValue === expectedAttributeValue;
}
