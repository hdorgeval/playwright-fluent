import { ElementHandle } from 'playwright';

export async function handleDoesNotExist(
  selector: ElementHandle<Element> | undefined | null,
): Promise<boolean> {
  if (selector) {
    return false;
  }

  return true;
}
