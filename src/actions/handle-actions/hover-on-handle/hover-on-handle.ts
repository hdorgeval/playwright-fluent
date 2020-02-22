import { waitUntil, sleep, report } from '../../../utils';
import { scrollToHandle } from '../scroll-to-handle';
import { isHandleVisible } from '../is-handle-visible';
import { isHandleMoving } from '../is-handle-moving';
import { getClientRectangleOfHandle } from '../get-client-rectangle-of-handle';
import { ElementHandle, Page } from 'playwright';

export interface HoverOptions {
  timeoutInMilliseconds: number;
  stabilityInMilliseconds: number;
  steps: number;
  verbose: boolean;
}
export const defaultHoverOptions: HoverOptions = {
  timeoutInMilliseconds: 30000,
  stabilityInMilliseconds: 300,
  steps: 10,
  verbose: false,
};

export async function hoverOnHandle(
  selector: ElementHandle<Element> | undefined | null,
  name: string,
  page: Page | undefined,
  options: HoverOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot hover on '${name}' because no browser has been launched`);
  }

  if (!selector) {
    throw new Error(`Cannot hover on '${name}' because selector was not found in DOM`);
  }

  report('scrolling to selector ...', options.verbose);
  await scrollToHandle(selector);

  report('waiting for the selector to be visible ...', options.verbose);
  await waitUntil(
    () => isHandleVisible(selector, { verbose: options.verbose }),
    `Cannot hover on '${name}' because this selector is not visible`,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds,
      stabilityInMilliseconds: options.stabilityInMilliseconds,
      throwOnTimeout: true,
      verbose: options.verbose,
    },
  );

  report('waiting for the selector to stop moving ...', options.verbose);
  await waitUntil(
    async () => (await isHandleMoving(selector)) === false,
    `Cannot hover on '${name}' because this selector is always moving`,
    {
      timeoutInMilliseconds: options.timeoutInMilliseconds / 2,
      stabilityInMilliseconds: options.stabilityInMilliseconds / 2,
      throwOnTimeout: true,
      verbose: options.verbose,
    },
  );

  for (let index = 0; index < 3; index++) {
    await sleep(50);
    const clientRectangle = await getClientRectangleOfHandle(selector);
    if (clientRectangle === null) {
      continue;
    }
    const x = clientRectangle.left + clientRectangle.width / 2;
    const y = clientRectangle.top + clientRectangle.height / 2;
    report(`moving the mouse to x=${x} y=${y}`, options.verbose);
    await page.mouse.move(x, y, { steps: options.steps });
  }
}
