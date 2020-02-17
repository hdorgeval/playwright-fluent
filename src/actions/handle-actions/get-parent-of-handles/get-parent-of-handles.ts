import { ElementHandle } from 'playwright';

export async function getParentsOf(
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < handles.length; index++) {
    const element = handles[index];

    const jsHandle = await element.evaluateHandle((node) => node.parentElement);

    const parentElement = jsHandle.asElement();
    if (parentElement === null) {
      continue;
    }

    result.push(parentElement as ElementHandle<Element>);
  }

  return result;
}
