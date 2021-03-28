import { switchFromHandleToIframe, SwitchToIframeOptions } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../../../utils';
import { Frame, Page } from 'playwright';

export async function switchFromSelectorToIframe(
  selector: string,
  pageOrFrame: Page | Frame | null | undefined,
  options: SwitchToIframeOptions,
): Promise<Frame> {
  if (!pageOrFrame) {
    throw new Error(
      `Cannot switch to iframe from '${selector}' because no browser has been launched`,
    );
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, pageOrFrame, waitOptions);
  return switchFromHandleToIframe(handle, selector, pageOrFrame, options);
}
