import { ElementHandle, Frame, Page } from 'playwright';
import { defaultHoverOptions, hoverOnHandle, HoverOptions } from '../hover-on-handle';
import { getPageFrom, injectCursor } from '../../dom-actions';

export interface SwitchToIframeOptions extends HoverOptions {
  injectCursor: boolean;
}

export const defaultSwitchToIframeOptions: SwitchToIframeOptions = {
  ...defaultHoverOptions,
  injectCursor: true,
};

export async function switchFromHandleToIframe(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  pageProviderOrPageInstance: (() => Page | Frame | undefined) | Page | Frame | undefined,
  options: SwitchToIframeOptions,
): Promise<Frame> {
  const pageOrFrame = getPageFrom(pageProviderOrPageInstance);

  if (!pageOrFrame) {
    throw new Error(`Cannot switch to iframe from '${name}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(`Cannot switch to iframe from '${name}' because selector was not found in DOM`);
  }

  await hoverOnHandle(selector, name, pageOrFrame, options);
  const frame = await selector.contentFrame();

  if (!frame) {
    throw new Error(
      `Cannot switch to iframe from '${name}' because this selector does not seem to be an iframe.`,
    );
  }

  if (options.injectCursor) {
    await injectCursor(frame);
  }
  return frame;
}
