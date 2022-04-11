import { ElementHandle } from 'playwright';
import { report } from '../../../utils';
import { VerboseOptions } from '../is-handle-visible';

export async function isHandleDisabled(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const result = await selector.evaluate((el): boolean => {
    const inputElement = el as HTMLInputElement;
    if (inputElement && inputElement.disabled !== undefined) {
      return inputElement.disabled;
    }
    return false;
  });

  report(`handle is ${result ? 'disabled' : 'enabled'}`, options.verbose);

  return result;
}
