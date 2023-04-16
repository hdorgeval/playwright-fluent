import { ElementHandle } from 'playwright';
import { hasHandleRole } from '../has-handle-role';

export async function getHandlesWithRole(
  text: string,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const handle = handles[index];
    const hasRole = await hasHandleRole(handle, text);

    if (hasRole) {
      result.push(handle);
    }
  }

  return result;
}
