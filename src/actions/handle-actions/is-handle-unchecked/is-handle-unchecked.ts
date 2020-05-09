import { report } from '../../../utils';
import { VerboseOptions } from '../is-handle-visible';
import { ElementHandle } from 'playwright';

export async function isHandleUnchecked(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const result = await selector.evaluate((el): boolean => {
    const inputElement = el as HTMLInputElement;
    if (inputElement && inputElement.checked !== undefined) {
      return !inputElement.checked;
    }
    return true;
  });

  report(`handle is ${result ? 'unchecked' : 'checked'}`, options.verbose);

  return result;
}
