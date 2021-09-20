import { Frame, Page } from 'playwright';

export type SerializableDOMRect = Omit<DOMRect, 'toJSON'>;

export async function getClientRectangleOf(
  selector: string,
  pageOrFrame: Page | Frame | null | undefined,
): Promise<SerializableDOMRect> {
  if (!pageOrFrame) {
    throw new Error(
      `Cannot get the client rectangle of '${selector}' because no browser has been launched`,
    );
  }

  const stringifiedResult = await pageOrFrame.$eval(selector, (el: Element): string => {
    const clientRectangle = el && el.getBoundingClientRect();
    const result: SerializableDOMRect = {
      bottom: clientRectangle ? clientRectangle.bottom : 0,
      height: clientRectangle ? clientRectangle.height : 0,
      left: clientRectangle ? clientRectangle.left : 0,
      right: clientRectangle ? clientRectangle.right : 0,
      top: clientRectangle ? clientRectangle.top : 0,
      width: clientRectangle ? clientRectangle.width : 0,
      x: clientRectangle ? clientRectangle.x : 0,
      y: clientRectangle ? clientRectangle.y : 0,
    };
    return JSON.stringify(result);
  });

  const clientRectangle = JSON.parse(stringifiedResult);
  return clientRectangle;
}
