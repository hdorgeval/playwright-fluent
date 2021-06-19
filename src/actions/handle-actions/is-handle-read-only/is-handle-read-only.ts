import { report } from '../../../utils';
import { VerboseOptions } from '../is-handle-visible';
import { ElementHandle } from 'playwright';

export async function isHandleReadOnly(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const result = await selector.evaluate((el): boolean => {
    const inputElement = el as HTMLInputElement;
    if (inputElement && inputElement.readOnly !== undefined) {
      return inputElement.readOnly;
    }
    return false;
  });

  report(`handle is ${result ? 'read-only' : 'not read-only'}`, options.verbose);

  return result;
}
