import { getAttributeOfHandle } from '../get-attribute-of-handle';
import { ElementHandle } from 'playwright';

export async function getHandlesWithPlaceholder(
  text: string,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const handle = handles[index];
    const placeholder = await getAttributeOfHandle('placeholder', handle);

    if (placeholder && placeholder.includes(text)) {
      result.push(handle);
    }
  }

  return result;
}
