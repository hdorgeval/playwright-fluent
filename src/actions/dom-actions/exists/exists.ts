import { Frame, Page } from 'playwright';

export async function exists(
  selector: string,
  pageProviderOrPageInstance: (() => Page | Frame | undefined) | Page | Frame | undefined,
): Promise<boolean> {
  const page = getPageFrom(pageProviderOrPageInstance);

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

export function getPageFrom(
  pageProviderOrPageInstance: (() => Page | Frame | undefined) | Page | Frame | undefined,
): Page | Frame | undefined {
  if (typeof pageProviderOrPageInstance === 'function') {
    return pageProviderOrPageInstance();
  }
  return pageProviderOrPageInstance;
}
