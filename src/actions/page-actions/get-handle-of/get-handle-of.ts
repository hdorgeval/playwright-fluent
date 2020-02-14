import { Page, ElementHandle } from 'playwright';

export async function getHandleOf(
  selector: string,
  page: Page | undefined,
): Promise<ElementHandle<Element> | null> {
  if (!page) {
    return null;
  }

  try {
    const handle = await page.$(selector);
    return handle;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `An internal error has occured in Playwright API while getting handle of '${selector}'.`,
      error,
    );
    return null;
  }
}
