import { ElementHandle } from 'playwright';

export async function getAttributeOfHandle(
  attributeName: string,
  selector: ElementHandle<Element> | null | undefined,
): Promise<string | null> {
  if (!selector) {
    return null;
  }

  const result = await selector.getAttribute(attributeName);
  return result;
}
