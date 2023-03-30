import { ElementHandle } from 'playwright';
import { report } from '../../../utils';
import { VerboseOptions } from '../is-handle-visible';
import { getIntersectionRatioOfHandle } from '../get-intersection-ratio-of-handle';

declare const window: Window;

export async function isHandleNotVisibleInViewport(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return true;
  }

  const visibleRatio = await getIntersectionRatioOfHandle(selector);

  report(`visible ratio is ${visibleRatio}`, options.verbose);

  if (visibleRatio <= 0) {
    report(`selector is not visible in the current viewport`, options.verbose);
    return true;
  }

  try {
    const isTransparentOrHidden = await selector.evaluate((el): boolean => {
      const style = window.getComputedStyle(el);

      if (style && style.opacity && style.opacity === '0') {
        return true;
      }

      if (style && style.visibility === 'hidden') {
        return true;
      }

      return false;
    });

    return isTransparentOrHidden;
  } catch (error) {
    // Element has been removed from DOM while or just before selector.evaluate execution
    return true;
  }
}
