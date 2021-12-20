import { SelectorFluent } from '../../selector-api';
import {
  WaitUntilOptions,
  defaultWaitUntilOptions,
  waitUntil,
  noWaitNoThrowOptions,
} from '../../utils';
import * as action from '../../actions';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import { Frame, Page } from 'playwright';

export async function isVisibleInViewport(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorVisibleInViewport(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectVisibleInViewport(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorIsVisibleInViewport(
  selector: string,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => isVisibleInViewport(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      return `Selector '${selector}' is not visible.
  Either this selector is hidden or is outside of the current viewport.
  In that case you should hover over it before the assert, or you should use the assertion 'isVisible()' instead of 'isVisibleInViewport'.`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectIsVisibleInViewport(
  selector: SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => isVisibleInViewport(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }
      return `Selector '${selector.toString()}' is not visible.
  Either this selector is hidden or is outside of the current viewport.
  In that case you should hover over it before the assert, or you should use the assertion 'isVisible()' instead of 'isVisibleInViewport'.`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorIsVisibleInViewport(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsVisibleInViewport(selector, page, options);
  }

  return await expectThatSelectorObjectIsVisibleInViewport(selector, page, options);
}
