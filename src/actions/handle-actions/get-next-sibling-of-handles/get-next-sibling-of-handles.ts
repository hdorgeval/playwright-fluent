import { ElementHandle } from 'playwright';

export async function getNextSiblingsOf(
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const element = handles[index];

    const jsHandle = await element.evaluateHandle((node) => node.nextElementSibling);

    const nextSiblingElement = jsHandle.asElement();
    if (nextSiblingElement === null) {
      continue;
    }

    result.push(nextSiblingElement as ElementHandle<Element>);
  }

  return result;
}
