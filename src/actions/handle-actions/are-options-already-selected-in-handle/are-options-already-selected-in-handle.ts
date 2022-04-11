import { ElementHandle } from 'playwright';
import { getAllOptionsOfHandle } from '../get-all-options-of-handle';

export async function areOptionsAlreadySelectedInHandle(
  selector: ElementHandle<Element> | null | undefined,
  name: string,
  expectedOptionLabels: string[],
): Promise<boolean> {
  if (expectedOptionLabels.length === 0) {
    throw new Error(`You must specify at least one option for selector '${name}'`);
  }

  const allOptions = await getAllOptionsOfHandle(selector, name);

  const result = expectedOptionLabels.every((expectedLabel) =>
    allOptions
      .filter((option) => option.selected)
      .some((selectedOption) => selectedOption.label === expectedLabel),
  );

  return result;
}
