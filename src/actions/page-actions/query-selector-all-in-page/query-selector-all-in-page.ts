import { Page, ElementHandle, Frame } from 'playwright';

export async function querySelectorAllInPage(
  selector: string,
  page: Page | Frame | undefined,
): Promise<ElementHandle<Element>[]> {
  if (!page) {
    throw new Error(`Cannot query selector '${selector}' because no browser has been launched`);
  }

  const elements = await page.$$(selector);
  return elements;
}
