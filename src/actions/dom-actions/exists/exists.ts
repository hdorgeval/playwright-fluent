import { Frame, Page } from 'playwright';

export async function exists(selector: string, page: Page | Frame | undefined): Promise<boolean> {
  if (!page) {
    throw new Error(`Cannot check that '${selector}' exists because no browser has been launched`);
  }

  try {
    const result = await page.$(selector);

    if (result === null) {
      return false;
    }
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `An internal error has occured in Playwright API while checking if selector '${selector}' exists.`,
      error,
    );
    return false;
  }
}
