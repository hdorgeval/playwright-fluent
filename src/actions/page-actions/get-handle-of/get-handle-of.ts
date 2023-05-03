import { Page, ElementHandle, Frame } from 'playwright';
import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { exists, getPageFrom } from '../../dom-actions';

export async function getHandleOf(
  selector: string,
  pageProviderOrPageInstance: (() => Page | Frame | undefined) | Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<ElementHandle<Element> | null> {
  if (!pageProviderOrPageInstance) {
    return null;
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => exists(selector, pageProviderOrPageInstance),
    `Selector '${selector}' was not found in DOM`,
    options,
  );

  const page = getPageFrom(pageProviderOrPageInstance);
  if (!page) {
    return null;
  }
  try {
    const handle = await page.$(selector);
    return handle;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `An internal error has occured in Playwright API while getting an handle for selector '${selector}'.`,
      error,
    );
    return null;
  }
}
