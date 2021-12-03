import { switchFromHandleToIframe, SwitchToIframeOptions } from '../../handle-actions';
import { getHandleOf } from '../get-handle-of';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../../../utils';
import { getPageFrom } from '../../dom-actions';
import { Frame, Page } from 'playwright';

export async function switchFromSelectorToIframe(
  selector: string,
  pageProviderOrPageInstance: (() => Page | Frame | undefined) | Page | Frame | undefined,
  options: SwitchToIframeOptions,
): Promise<Frame> {
  const pageOrFrame = getPageFrom(pageProviderOrPageInstance);

  if (!pageOrFrame) {
    throw new Error(
      `Cannot switch to iframe from '${selector}' because no browser has been launched`,
    );
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  const handle = await getHandleOf(selector, pageProviderOrPageInstance, waitOptions);
  return switchFromHandleToIframe(handle, selector, pageProviderOrPageInstance, options);
}
