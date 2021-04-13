import { hoverOnHandle, HoverOptions, defaultHoverOptions } from '../hover-on-handle';
import { waitUntil, report } from '../../../utils';
import { isHandleEnabled } from '../is-handle-enabled';
import { isHandleChecked } from '../is-handle-checked';
import { ElementHandle, Frame, Page } from 'playwright';

export interface CheckOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}

export const defaultCheckOptions: CheckOptions = {
  stabilityInMilliseconds: 300,
  timeoutInMilliseconds: 30000,
  verbose: false,
};

export async function checkHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  page: Page | Frame | undefined,
  options: CheckOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot check '${name}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(`Cannot check '${name}' because selector was not found in DOM`);
  }

  const hoverOptions: HoverOptions = {
    ...defaultHoverOptions,
    verbose: options.verbose,
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
  };
  await hoverOnHandle(selector, name, page, hoverOptions);

  report('Checking if selector is already checked ...', options.verbose);
  const isChecked = await isHandleChecked(selector, { verbose: options.verbose });
  if (isChecked) {
    report('Selector is already checked: nothing to do.', options.verbose);
    return;
  }

  report('waiting for the selector to be enabled ...', options.verbose);
  await waitUntil(
    () => isHandleEnabled(selector, { verbose: false }),
    `Cannot check '${name}' because this selector is disabled`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  await selector.check();
}
