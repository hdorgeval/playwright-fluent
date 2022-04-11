import { ElementHandle, Frame, Page } from 'playwright';
import { hoverOnHandle, HoverOptions, defaultHoverOptions } from '../hover-on-handle';
import { waitUntil, report } from '../../../utils';
import { isHandleEnabled } from '../is-handle-enabled';
import { isHandleChecked } from '../is-handle-checked';
import { CheckOptions } from '../check-handle';

export async function uncheckHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  page: Page | Frame | undefined,
  options: CheckOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot uncheck '${name}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(`Cannot uncheck '${name}' because selector was not found in DOM`);
  }

  const hoverOptions: HoverOptions = {
    ...defaultHoverOptions,
    verbose: options.verbose,
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
  };
  await hoverOnHandle(selector, name, page, hoverOptions);

  report('Checking if selector is already unchecked ...', options.verbose);
  const isChecked = await isHandleChecked(selector, { verbose: options.verbose });
  if (!isChecked) {
    report('Selector is already unchecked: nothing to do.', options.verbose);
    return;
  }

  report('waiting for the selector to be enabled ...', options.verbose);
  await waitUntil(
    () => isHandleEnabled(selector, { verbose: false }),
    `Cannot uncheck '${name}' because this selector is disabled`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  await selector.uncheck();
}
