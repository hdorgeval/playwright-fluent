import { ElementHandle } from 'playwright';

export async function getPreviousSiblingsOf(
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const element = handles[index];

    const jsHandle = await element.evaluateHandle((node) => node.previousElementSibling);

    const previousSiblingElement = jsHandle.asElement();
    if (previousSiblingElement === null) {
      continue;
    }

    result.push(previousSiblingElement as ElementHandle<Element>);
  }

  return result;
}
