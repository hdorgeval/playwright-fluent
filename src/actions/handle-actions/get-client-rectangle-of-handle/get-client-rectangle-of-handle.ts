import { ElementHandle } from 'playwright';

export async function getClientRectangleOfHandle(
  selector: ElementHandle<Element> | null | undefined,
): Promise<ClientRect | null> {
  if (!selector) {
    return null;
  }

  const stringifiedResult = await selector.evaluate((el: Element): string => {
    const clientRectangle = el && el.getBoundingClientRect();
    const result: ClientRect = {
      bottom: clientRectangle ? clientRectangle.bottom : 0,
      height: clientRectangle ? clientRectangle.height : 0,
      top: clientRectangle ? clientRectangle.top : 0,
      width: clientRectangle ? clientRectangle.width : 0,
      left: clientRectangle ? clientRectangle.left : 0,
      right: clientRectangle ? clientRectangle.right : 0,
    };
    return JSON.stringify(result);
  });

  const clientRectangle = JSON.parse(stringifiedResult) as ClientRect;
  return clientRectangle;
}
