import { SelectOptions, selectOptionsInHandle } from '../../handle-actions';
import { WaitUntilOptions, defaultWaitUntilOptions, report, waitUntil } from '../../../utils';
import { getFocusedHandle } from '../get-focused-handle';
import { Frame, Page } from 'playwright';

export async function selectOptionsInFocused(
  labels: string[],
  page: Page | Frame | undefined,
  options: SelectOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot select options '${labels}' because no browser has been launched`);
  }

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  report('waiting for a select element to have focus ...', options.verbose);
  await waitUntil(
    async () => {
      const focusedHandle = await getFocusedHandle(page);
      if (focusedHandle === null) {
        return false;
      }
      const tagName = await focusedHandle.evaluate((el) => el.tagName);
      if (tagName && tagName === 'SELECT') {
        return true;
      }
      return false;
    },
    async () => {
      const focusedHandle = await getFocusedHandle(page);
      if (focusedHandle === null) {
        return 'No element has the focus. You must first set the focus on a select element.';
      }
      const tagName = await focusedHandle.evaluate((el) => el.tagName);
      if (tagName && tagName !== 'SELECT') {
        return `The element that has the focus is '${tagName}', but it should be a 'SELECT' element instead.`;
      }

      return 'never';
    },
    waitOptions,
  );

  const handle = await getFocusedHandle(page);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const outerHtml = await handle!.evaluate((el) => el.outerHTML);
  await selectOptionsInHandle(handle, outerHtml, labels, page, options);
}
