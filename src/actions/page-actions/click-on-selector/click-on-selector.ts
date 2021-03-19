import { ClickOptions, clickOnHandle } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { WaitUntilOptions, defaultWaitUntilOptions } from '../../../utils';
import { Frame, Page } from 'playwright';

export async function clickOnSelector(
  selector: string,
  page: Page | Frame | undefined,
  options: ClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot click on '${selector}' because no browser has been launched`);
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, page, waitOptions);
  await clickOnHandle(handle, selector, page, options);
}
