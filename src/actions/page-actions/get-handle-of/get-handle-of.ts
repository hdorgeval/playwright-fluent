import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { exists } from '../../dom-actions';
import { Page, ElementHandle } from 'playwright';

export async function getHandleOf(
  selector: string,
  page: Page | undefined,
  options: WaitUntilOptions,
): Promise<ElementHandle<Element> | null> {
  if (!page) {
    return null;
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => exists(selector, page),
    `Selector '${selector}' was not found in DOM`,
    options,
  );

  const handle = await page.$(selector);
  return handle;
}
