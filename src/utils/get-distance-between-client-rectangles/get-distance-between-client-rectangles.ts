export function getDistanceBetweenClientRectangles(rect1: ClientRect, rect2: ClientRect): number {
  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;

  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
}
