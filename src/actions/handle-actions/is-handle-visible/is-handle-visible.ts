import { report } from '../../../utils';
import { getIntersectionRatioOfHandle } from '../get-intersection-ratio-of-handle';
import { ElementHandle } from 'playwright';

declare const window: Window;

export interface VerboseOptions {
  verbose: boolean;
}

export const defaultVerboseOptions: VerboseOptions = {
  verbose: false,
};

export async function isHandleVisible(
  selector: ElementHandle<Element> | undefined | null,
  options: VerboseOptions,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const visibleRatio = await getIntersectionRatioOfHandle(selector);

  report(`visible ratio is ${visibleRatio}`, options.verbose);

  if (visibleRatio <= 0) {
    report(`selector is not visible in the current viewport`, options.verbose);
    return false;
  }

  const result = await selector.evaluate((el): boolean => {
    function hasVisibleBoundingBox(element: Element): boolean {
      const rect = element.getBoundingClientRect();
      return !!(rect.top || rect.bottom || rect.width || rect.height);
    }

    const style = window.getComputedStyle(el);

    if (style && style.opacity && style.opacity === '0') {
      return false;
    }

    const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox(el);
    return isVisible;
  });

  return result;
}
