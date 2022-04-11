import { ElementHandle } from 'playwright';
import { hasHandleAriaLabel } from '../has-handle-aria-label';

export async function getHandlesWithAriaLabel(
  text: string,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const handle = handles[index];
    const hasAriaLabel = await hasHandleAriaLabel(handle, text);

    if (hasAriaLabel) {
      result.push(handle);
    }
  }

  return result;
}
