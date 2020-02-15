import { ElementHandle } from 'playwright';

declare const window: Window;
export async function isHandleVisible(
  selector: ElementHandle<Element> | undefined | null,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }

  const visibleRatio = await selector.visibleRatio();
  // eslint-disable-next-line no-console
  console.log(`visible ratio is ${visibleRatio}`);
  if (visibleRatio <= 0) {
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
