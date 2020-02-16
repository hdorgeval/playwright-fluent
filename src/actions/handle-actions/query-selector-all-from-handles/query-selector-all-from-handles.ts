import { ElementHandle } from 'playwright';

export async function querySelectorAllFromHandles(
  selector: string,
  rootElements: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  const result: ElementHandle<Element>[] = [];

  for (let index = 0; index < rootElements.length; index++) {
    const rootElement = rootElements[index];
    const foundElements = await rootElement.$$(selector);
    result.push(...foundElements);
  }

  return result;
}
