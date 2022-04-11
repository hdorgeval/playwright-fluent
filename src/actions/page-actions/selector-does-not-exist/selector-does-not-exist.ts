import { Frame, Page } from 'playwright';
import { report, waitUntil, WaitUntilOptions } from '../../../utils';
import { doesNotExist } from '../../dom-actions';

export async function selectorDoesNotExist(
  selector: string,
  page: Page | Frame | undefined,
  options: WaitUntilOptions,
): Promise<boolean> {
  if (!page) {
    throw new Error(
      `Cannot check that '${selector}' does not exist because no browser has been launched`,
    );
  }

  report('waiting for the selector to disappear from DOM ...', options.verbose);
  await waitUntil(
    () => doesNotExist(selector, page),
    `Selector '${selector}' was found in DOM`,
    options,
  );

  const result = await doesNotExist(selector, page);
  return result;
}
