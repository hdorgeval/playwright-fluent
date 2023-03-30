import { ElementHandle } from 'playwright';
declare const IntersectionObserver: {
  prototype: IntersectionObserver;
  new (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ): IntersectionObserver;
};
declare function requestAnimationFrame(callback: FrameRequestCallback): number;
export async function getIntersectionRatioOfHandle(
  selector: ElementHandle<Element> | null | undefined,
): Promise<number> {
  if (!selector) {
    return -1;
  }

  try {
    // this code was taken from Playwright visibleRatio()
    // that has been been removed from src/dom.ts:482 (version 0.11.1)
    const result = await selector.evaluate(async (el): Promise<number> => {
      const visibleRatio = await new Promise<number>((resolve) => {
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
          resolve(entries[0].intersectionRatio);
          observer.disconnect();
        });
        observer.observe(el);
        // Firefox doesn't call IntersectionObserver callback unless
        // there are rafs.
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        requestAnimationFrame(() => {});
      });
      return visibleRatio;
    });

    return result;
  } catch (error) {
    // Element has been removed from DOM while or just before selector.evaluate execution
    return -1;
  }
}
