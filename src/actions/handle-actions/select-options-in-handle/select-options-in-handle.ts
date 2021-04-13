import { HoverOptions, defaultHoverOptions, hoverOnHandle } from '../hover-on-handle';
import { areOptionsAlreadySelectedInHandle } from '../are-options-already-selected-in-handle';
import { report, waitUntil } from '../../../utils';
import { isHandleEnabled } from '../is-handle-enabled';
import { areOptionsAvailableInHandle } from '../are-options-available-in-handle';
import { getAllOptionsOfHandle } from '../get-all-options-of-handle';
import { ElementHandle, Frame, Page } from 'playwright';

export interface SelectOptions {
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}
export const defaultSelectOptions: SelectOptions = {
  stabilityInMilliseconds: 300,
  timeoutInMilliseconds: 30000,
  verbose: false,
};

export async function selectOptionsInHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  labels: string[],
  page: Page | Frame | undefined,
  options: SelectOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot select options '${labels}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(
      `Cannot select options '${labels}' in '${name}' because selector was not found in DOM`,
    );
  }

  const hoverOptions: HoverOptions = {
    ...defaultHoverOptions,
    verbose: options.verbose,
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
  };
  await hoverOnHandle(selector, name, page, hoverOptions);

  const areOptionsAlreadySelected = await areOptionsAlreadySelectedInHandle(selector, name, labels);
  if (areOptionsAlreadySelected) {
    return;
  }

  report('waiting for the selector to be enabled ...', options.verbose);
  await waitUntil(
    () => isHandleEnabled(selector, { verbose: false }),
    `Cannot select options '${labels}' in '${name}' because this selector is disabled`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  report('waiting for the options to be available ...', options.verbose);
  await waitUntil(
    () => areOptionsAvailableInHandle(selector, name, labels),
    async () => {
      const existingOptions = await getAllOptionsOfHandle(selector, name);
      const existingLabels = existingOptions.map((o) => o.label);
      return `Cannot select options '${labels}' in '${name}' because this selector has only options '${existingLabels}'`;
    },
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  const values = labels.map((label) => {
    return {
      label,
    };
  });

  await selector.selectOption(values);
}
