import { ElementHandle } from 'playwright';

export async function getClassListOfHandle(
  selector: ElementHandle<Element> | null | undefined,
): Promise<string[]> {
  if (!selector) {
    return [];
  }

  const stringifiedClassList = await selector.evaluate((el: Element): string => {
    const classList = Array.from(el.classList);
    return JSON.stringify(classList);
  });

  const classList: string[] = JSON.parse(stringifiedClassList);
  if (!Array.isArray(classList)) {
    return [];
  }

  return classList;
}
