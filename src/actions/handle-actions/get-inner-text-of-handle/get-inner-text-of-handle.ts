import { ElementHandle } from 'playwright';

export async function getInnerTextOfHandle(
  selector: ElementHandle<Element> | null | undefined,
): Promise<string | null | undefined> {
  if (!selector) {
    return null;
  }

  const result = await selector.evaluate((el: HTMLElement | Element): string => {
    const inputElement = el as HTMLElement;
    return inputElement && inputElement.innerText;
  });

  if (typeof result === 'string') {
    return result.replace(/\s/g, ' ');
  }

  return result;
}
