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

export async function hasFocus(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasSelectorFocus(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.hasSelectorObjectFocus(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorHasFocus(
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
    () => hasFocus(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      return `Selector '${selector}' does not have the focus.`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectHasFocus(
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
    () => hasFocus(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }
      return `Selector '${selector.toString()}' does not have the focus.`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorHasFocus(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorHasFocus(selector, page, options);
  }

  return await expectThatSelectorObjectHasFocus(selector, page, options);
}
