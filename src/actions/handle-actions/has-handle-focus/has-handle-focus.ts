import { ElementHandle } from 'playwright';

declare const window: Window;
export async function hasHandleFocus(
  selector: ElementHandle<Element> | undefined | null,
): Promise<boolean> {
  if (selector === undefined || selector === null) {
    return false;
  }
  const result = await selector.evaluate((el): boolean => {
    const focusedElement = window.document.activeElement;
    if (!focusedElement) {
      return false;
    }
    if (focusedElement.tagName !== el.tagName) {
      return false;
    }
    return focusedElement.isSameNode(el);
  });

  return result;
}
