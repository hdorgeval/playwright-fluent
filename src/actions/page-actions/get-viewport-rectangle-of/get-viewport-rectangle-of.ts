import { Frame, Page } from 'playwright';

declare const window: Window;

export interface ViewportRect {
  height: number;
  offsetLeft: number;
  offsetTop: number;
  pageLeft: number;
  pageTop: number;
  scale: number;
  width: number;
}
export async function getViewportRectangleOf(
  page: Page | Frame | undefined,
): Promise<ViewportRect | null> {
  if (!page) {
    throw new Error(`Cannot get the page viewport because no browser has been launched`);
  }

  const stringifiedResult = await page.evaluate((): string | null => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewportRectangle: ViewportRect = (window as any).visualViewport;
    if (!viewportRectangle) {
      return null;
    }
    const result: ViewportRect = {
      height: viewportRectangle.height,
      offsetLeft: viewportRectangle.offsetLeft,
      offsetTop: viewportRectangle.offsetTop,
      pageLeft: viewportRectangle.pageLeft,
      pageTop: viewportRectangle.pageTop,
      scale: viewportRectangle.scale,
      width: viewportRectangle.width,
    };
    return JSON.stringify(result);
  });

  if (stringifiedResult === null) {
    return null;
  }
  const rectangle = JSON.parse(stringifiedResult) as ViewportRect;
  return rectangle;
}
