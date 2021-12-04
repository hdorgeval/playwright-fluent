import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { exists, getPageFrom } from '../../dom-actions';
import { Page, ElementHandle, Frame } from 'playwright';

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
  const handle = await page.$(selector);
  return handle;
}
