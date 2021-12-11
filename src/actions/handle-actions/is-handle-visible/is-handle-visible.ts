import { report } from '../../../utils';
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

  const isOutOfScreenOrTransparent = await selector.evaluate((el): boolean => {
    const style = window.getComputedStyle(el);
    if (style && style.opacity && style.opacity === '0') {
      return true;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top + rect.height < 0 && style?.position === 'absolute') {
      return true;
    }

    if (rect.left + rect.width < 0 && style?.position === 'absolute') {
      return true;
    }

    return false;
  });

  if (isOutOfScreenOrTransparent) {
    report(
      `Selector is not visible because it is either transparent or out of screen`,
      options.verbose,
    );
    return false;
  }

  const result = await selector.isVisible();
  return result;
}
