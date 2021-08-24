import { ElementHandle } from 'playwright';

export async function getHandlesWithExactText(
  text: string,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const handle = handles[index];

    const innerText = await handle.evaluate((node) => {
      const nodeWithText = node as HTMLElement;
      if (nodeWithText && typeof nodeWithText.innerText === 'string') {
        return nodeWithText.innerText.replace(/\s/g, ' ');
      }

      return '';
    });

    if (innerText === text) {
      result.push(handle);
    }
  }

  return result;
}
