import { ElementHandle, Frame, Page } from 'playwright';
import { HoverOptions, defaultHoverOptions, hoverOnHandle } from '../hover-on-handle';
import { report, waitUntil } from '../../../utils';
import { isHandleEnabled } from '../is-handle-enabled';
import { getAllOptionsOfHandle } from '../get-all-options-of-handle';
import { SelectOptions } from '../select-options-in-handle';
import { areOptionsByValueAlreadySelectedInHandle } from '../are-options-by-value-already-selected-in-handle';
import { areOptionsByValueAvailableInHandle } from '../are-options-by-value-available-in-handle';

export async function selectOptionsByValueInHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  values: string[],
  page: Page | Frame | undefined,
  options: SelectOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot select options '${values}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(
      `Cannot select options '${values}' in '${name}' because selector was not found in DOM`,
    );
  }

  const hoverOptions: HoverOptions = {
    ...defaultHoverOptions,
    verbose: options.verbose,
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
  };
  await hoverOnHandle(selector, name, page, hoverOptions);

  const areOptionsAlreadySelected = await areOptionsByValueAlreadySelectedInHandle(
    selector,
    name,
    values,
  );
  if (areOptionsAlreadySelected) {
    return;
  }

  report('waiting for the selector to be enabled ...', options.verbose);
  await waitUntil(
    () => isHandleEnabled(selector, { verbose: false }),
    `Cannot select options '${values}' in '${name}' because this selector is disabled`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  report('waiting for the options to be available ...', options.verbose);
  await waitUntil(
    () => areOptionsByValueAvailableInHandle(selector, name, values),
    async () => {
      const existingOptions = await getAllOptionsOfHandle(selector, name);
      const existingValues = existingOptions.map((o) => o.value);
      return `Cannot select options '${values}' in '${name}' because this selector has only options '${existingValues}'`;
    },
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const byValues = values.map((value) => {
    return {
      value,
    };
  });

  await selector.selectOption(byValues);
}
