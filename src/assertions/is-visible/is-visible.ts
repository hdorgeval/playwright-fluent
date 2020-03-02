import { SelectorController } from '../../selector';
import {
  WaitUntilOptions,
  defaultWaitUntilOptions,
  waitUntil,
  noWaitNoThrowOptions,
} from '../../utils';
import * as action from '../../actions';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import { Page } from 'playwright';

export async function isVisible(
  selector: string | SelectorController,
  page: Page | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorVisible(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectVisible(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorIsVisible(
  selector: string,
  page: Page | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => isVisible(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      return `Selector '${selector}' is not visible.
  Either this selector is hidden or is outside of the current viewport.
  In that case you should hover over it before the assert.`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectIsVisible(
  selector: SelectorController,
  page: Page | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => isVisible(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }
      return `Selector '${selector.toString()}' is not visible.
  Either this selector is hidden or is outside of the current viewport.
  In that case you should hover over it before the assert.`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorIsVisible(
  selector: string | SelectorController,
  page: Page | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsVisible(selector, page, options);
  }

  return await expectThatSelectorObjectIsVisible(selector, page, options);
}
