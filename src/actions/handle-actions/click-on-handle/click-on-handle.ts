import { ElementHandle, Frame, Page } from 'playwright';
import { hoverOnHandle, HoverOptions, defaultHoverOptions } from '../hover-on-handle';
import { waitUntil, report } from '../../../utils';
import { isHandleEnabled } from '../is-handle-enabled';

export type Modifier = 'Alt' | 'Control' | 'Meta' | 'Shift';
export type Button = 'left' | 'right' | 'middle';
export type Point = {
  x: number;
  y: number;
};
export interface ClickOptions {
  button: Button;
  clickCount: number;
  delay: number;
  modifiers?: Modifier[];
  position?: Point;
  stabilityInMilliseconds: number;
  timeoutInMilliseconds: number;
  verbose: boolean;
}

export const defaultClickOptions: ClickOptions = {
  button: 'left',
  clickCount: 1,
  delay: 100,
  stabilityInMilliseconds: 300,
  timeoutInMilliseconds: 30000,
  verbose: false,
};

export async function clickOnHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  page: Page | Frame | undefined,
  options: ClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot click on '${name}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(`Cannot click on '${name}' because selector was not found in DOM`);
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
    `Cannot click on '${name}' because this selector is disabled`,
    {
      ...options,
      throwOnTimeout: true,
      wrapPredicateExecutionInsideTryCatch: true,
    },
  );

  await selector.click(options);
}
