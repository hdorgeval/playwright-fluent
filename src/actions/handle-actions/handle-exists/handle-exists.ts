import { ElementHandle } from 'playwright';

export async function handleExists(
  selector: ElementHandle<Element> | undefined | null,
): Promise<boolean> {
  if (selector) {
    return true;
  }

  return false;
}
