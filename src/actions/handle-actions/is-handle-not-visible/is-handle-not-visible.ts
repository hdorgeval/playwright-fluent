import { report } from '../../../utils';
import { VerboseOptions } from '../is-handle-visible';
import { ElementHandle } from 'playwright';

declare const window: Window;

export async function isHandleNotVisible(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return true;
  }

  const visibleRatio = await selector.visibleRatio();

  report(`visible ratio is ${visibleRatio}`, options.verbose);

  if (visibleRatio <= 0) {
    report(`selector is not visible in the current viewport`, options.verbose);
    return true;
  }

  const result = await selector.evaluate((el): boolean => {
    const style = window.getComputedStyle(el);

    if (style && style.opacity && style.opacity === '0') {
      return true;
    }

    if (style && style.visibility === 'hidden') {
      return true;
    }

    return false;
  });

  return result;
}
