import { hasHandleValue } from '../has-handle-value';
import { ElementHandle } from 'playwright';

export async function getHandlesWithValue(
  text: string,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const handle = handles[index];

    const hasValue = await hasHandleValue(handle, text);
    if (hasValue) {
      result.push(handle);
    }
  }

  return result;
}
