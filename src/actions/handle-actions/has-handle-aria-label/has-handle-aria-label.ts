import { ElementHandle } from 'playwright';
import { getAttributeOfHandle } from '../get-attribute-of-handle';

export async function hasHandleAriaLabel(
  handle: ElementHandle<Element> | undefined | null,
  expectedAriaLabel: string,
): Promise<boolean> {
  if (!handle) {
    return false;
  }

  const label = await getAttributeOfHandle('aria-label', handle);

  return label === expectedAriaLabel;
}
