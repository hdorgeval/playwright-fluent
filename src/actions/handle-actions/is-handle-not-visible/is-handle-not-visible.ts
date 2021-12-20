import { isHandleVisible, VerboseOptions } from '../is-handle-visible';
import { ElementHandle } from 'playwright';

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
