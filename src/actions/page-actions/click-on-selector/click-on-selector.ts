import { ClickOptions, clickOnHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { Page } from 'playwright';

export async function clickOnSelector(
  selector: string,
  page: Page | undefined,
  options: ClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot click on '${selector}' because no browser has been launched`);
  }

  const handle = await getHandleOf(selector, page, {
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    throwOnTimeout: true,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
    verbose: options.verbose,
  });

  await clickOnHandle(handle, selector, page, options);
}
