import { Frame, Page } from 'playwright';

export async function doesNotExist(
  selector: string,
  page: Page | Frame | undefined,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' does not exist because no browser has been launched`,
    );
  }

  try {
    const result = await page.$(selector);

    if (result === null) {
      return true;
    }
    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `An internal error has occured in Playwright API while checking if selector '${selector}' does not exist.`,
      error,
    );
    return true;
  }
}
