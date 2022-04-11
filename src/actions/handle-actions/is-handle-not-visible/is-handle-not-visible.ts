import { ElementHandle } from 'playwright';
import { isHandleVisible, VerboseOptions } from '../is-handle-visible';

export async function isHandleNotVisible(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return true;
  }

  const result = !(await isHandleVisible(selector, options));
  return result;
}
