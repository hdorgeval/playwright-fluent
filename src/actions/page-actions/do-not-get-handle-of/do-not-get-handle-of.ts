import { waitUntil, report, WaitUntilOptions } from '../../../utils';
import { doesNotExist } from '../../dom-actions';
import { Page, Frame } from 'playwright';

export async function doNotGetHandleOf(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<null> {
  if (!page) {
    return null;
  }

  report('waiting for the selector to disappear from DOM ...', options.verbose);
  await waitUntil(
    () => doesNotExist(selector, page),
    `Selector '${selector}' was found in DOM`,
    options,
  );

  return null;
}
