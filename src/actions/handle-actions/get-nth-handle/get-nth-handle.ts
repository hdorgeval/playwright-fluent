import { ElementHandle } from 'playwright';

export async function getNthHandle(
  index: number,
  handles: ElementHandle<Element>[],
): Promise<ElementHandle<Element>[]> {
  if (index === 0) {
    throw new Error('Index is one-based');
  }
  if (Math.abs(index) > handles.length) {
    return [];
  }

  const currentHandles = [...handles];

  if (index > 0) {
    let nthHandle: ElementHandle<Element> | undefined;
    for (let i = 1; i <= index; i++) {
      nthHandle = currentHandles.shift();
    }
    return nthHandle ? [nthHandle] : [];
  }

  if (index < 0) {
    let nthHandle: ElementHandle<Element> | undefined;
    for (let i = 1; i <= -index; i++) {
      nthHandle = currentHandles.pop();
    }
    return nthHandle ? [nthHandle] : [];
  }

  return [];
}
