import { ElementHandle } from 'playwright';
import { SerializableDOMRect } from '../../dom-actions/get-client-rectangle-of';

export async function getClientRectangleOfHandle(
  selector: ElementHandle<Element> | null | undefined,
): Promise<SerializableDOMRect | null> {
  if (!selector) {
    return null;
  }

  const stringifiedResult = await selector.evaluate((el: Element): string => {
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
