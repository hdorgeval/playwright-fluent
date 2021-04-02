import { Frame, Page } from 'playwright';

export function toPage(pageOrFrame: Page | Frame): Page {
  const page = pageOrFrame as Page;
  const frame = pageOrFrame as Frame;

  if (frame.page) {
    return frame.page();
  }

  return page;
}

export function toFrame(pageOrFrame: Page | Frame): Frame | undefined {
  const frame = pageOrFrame as Frame;

  if (typeof frame.page === 'function') {
    return frame;
  }

  return undefined;
}
