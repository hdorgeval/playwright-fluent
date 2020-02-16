import { HoverOptions, hoverOnHandle } from '../../handle-actions';
import { waitUntil, report } from '../../../utils';
import { exists } from '../../dom-actions';
import { Page } from 'playwright';

export async function hoverOnSelector(
  selector: string,
  page: Page | undefined,
  options: HoverOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot hover on '${selector}' because no browser has been launched`);
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => exists(selector, page),
    `Cannot hover on '${selector}' because this selector was not found in DOM`,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
      stabilityInMilliseconds: options.stabilityInMilliseconds,
      throwOnTimeout: true,
      verbose: options.verbose,
    },
  );

  const handle = await page.$(selector);
  await hoverOnHandle(handle, selector, page, options);
}
