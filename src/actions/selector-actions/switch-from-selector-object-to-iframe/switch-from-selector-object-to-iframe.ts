import { Frame, Page } from 'playwright';
import { waitUntil, report } from '../../../utils';
import { SelectorFluent } from '../../../selector-api';
import { switchFromHandleToIframe, SwitchToIframeOptions } from '../../handle-actions';
import { getPageFrom } from '../../dom-actions';

export async function switchFromSelectorObjectToIframe(
  selector: SelectorFluent,
  pageProviderOrPageInstance: (() => Page | Frame | undefined) | Page | Frame | undefined,
  options: SwitchToIframeOptions,
): Promise<Frame> {
  const pageOrFrame = getPageFrom(pageProviderOrPageInstance);

  if (!pageOrFrame) {
    throw new Error(
      `Cannot switch to iframe from '${selector.toString()}' because no browser has been launched`,
    );
  }

  report('waiting for the selector to appear in DOM ...', options.verbose);
  await waitUntil(
    () => selector.exists(),
    `Cannot switch to iframe from '${selector.toString()}' because this selector was not found in DOM`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const handle = await selector.getHandle();
  return switchFromHandleToIframe(handle, selector.toString(), pageOrFrame, options);
}
