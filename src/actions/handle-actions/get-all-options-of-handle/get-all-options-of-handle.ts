import { ElementHandle } from 'playwright';

export interface SelectOptionInfo {
  value: string;
  label: string;
  selected: boolean;
}
export async function getAllOptionsOfHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
): Promise<SelectOptionInfo[]> {
  if (!selector) {
    return [];
  }

  const stringifiedResult = await selector.evaluate((el: Element): string | null => {
    const selectElement = el as HTMLSelectElement;

    if (!selectElement.options) {
      return null;
    }
    const options = Array.from(selectElement.options);
    const infos = options.map((option: HTMLOptionElement) => {
      return {
        value: option.value,
        label: option.label,
        selected: option.selected,
      };
    });
    return JSON.stringify(infos);
  });

  if (stringifiedResult === null) {
    throw new Error(`Cannot find any options in selector '${name}'`);
  }

  const result = JSON.parse(stringifiedResult) as SelectOptionInfo[];
  return result;
}
