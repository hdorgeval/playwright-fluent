import { getClientRectangleOfHandle } from '../get-client-rectangle-of-handle';
import { sleep, getDistanceBetweenClientRectangles } from '../../../utils';
import { ElementHandle } from 'playwright';

export async function isHandleMoving(
  selector: ElementHandle<Element> | null | undefined,
): Promise<boolean> {
  if (!selector) {
    return false;
  }

  const previousClientRectangle = await getClientRectangleOfHandle(selector);
  await sleep(50);
  const currentClientRectangle = await getClientRectangleOfHandle(selector);

  if (previousClientRectangle === null || currentClientRectangle === null) {
    return false;
  }

  const threshold = 5;
  const distance = getDistanceBetweenClientRectangles(
    currentClientRectangle,
    previousClientRectangle,
  );

  return distance >= threshold;
}
