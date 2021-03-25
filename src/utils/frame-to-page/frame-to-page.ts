import { Frame, Page } from 'playwright';

export function toPage(pageOrFrame: Page | Frame): Page {
  const page = pageOrFrame as Page;
  const frame = pageOrFrame as Frame;

  if (frame.page) {
    return frame.page();
  }

  return page;
}
