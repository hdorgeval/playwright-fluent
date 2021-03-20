import { Page, ElementHandle, Frame } from 'playwright';
declare const window: Window;

export async function getFocusedHandle(
  page: Page | Frame | undefined,
): Promise<ElementHandle<Element> | null> {
  if (!page) {
    throw new Error(`Cannot get focused handle because no browser has been launched`);
  }
  const focusedElement = await page.evaluateHandle(() => window.document.activeElement);

  if (focusedElement === null) {
    return null;
  }

  const handle = focusedElement.asElement();
  return handle;
}
