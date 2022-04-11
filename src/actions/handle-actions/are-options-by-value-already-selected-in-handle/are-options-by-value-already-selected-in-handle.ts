import { ElementHandle } from 'playwright';
import { getAllOptionsOfHandle } from '../get-all-options-of-handle';

export async function areOptionsByValueAlreadySelectedInHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
  expectedOptionValues: string[],
): Promise<boolean> {
  if (expectedOptionValues.length === 0) {
    throw new Error(`You must specify at least one option for selector '${name}'`);
  }

  const allOptions = await getAllOptionsOfHandle(selector, name);

  const result = expectedOptionValues.every((expectedValue) =>
    allOptions
      .filter((option) => option.selected)
      .some((selectedOption) => selectedOption.value === expectedValue),
  );

  return result;
}
