import { hoverOnHandle, HoverOptions, defaultHoverOptions } from '../hover-on-handle';
import { waitUntil, report } from '../../../utils';
import { isHandleEnabled } from '../is-handle-enabled';
import { Button, Modifier, Point } from '../click-on-handle';
import { ElementHandle, Page } from 'playwright';

export interface DoubleClickOptions {
  button: Button;
  delay: number;
  modifiers?: Modifier[];
  position?: Point;
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}

export const defaultDoubleClickOptions: DoubleClickOptions = {
  button: 'left',
  delay: 100,
  stabilityInMilliseconds: 300,
  timeoutInMilliseconds: 30000,
  verbose: false,
};

export async function doubleClickOnHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  page: Page | undefined,
  options: DoubleClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot double-click on '${name}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(`Cannot double-click on '${name}' because selector was not found in DOM`);
  }

  const hoverOptions: HoverOptions = {
    ...defaultHoverOptions,
    verbose: options.verbose,
    stabilityInMilliseconds: options.stabilityInMilliseconds,
    timeoutInMilliseconds: options.timeoutInMilliseconds,
  };
  await hoverOnHandle(selector, name, page, hoverOptions);

  report('waiting for the selector to be enabled ...', options.verbose);
  await waitUntil(
    () => isHandleEnabled(selector, { verbose: false }),
    `Cannot double-click on '${name}' because this selector is disabled`,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
      stabilityInMilliseconds: options.stabilityInMilliseconds,
      throwOnTimeout: true,
      verbose: options.verbose,
    },
  );

  await selector.dblclick(options);
}
