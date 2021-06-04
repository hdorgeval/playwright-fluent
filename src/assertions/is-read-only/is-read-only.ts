import { SelectorFluent } from '../../selector-api';
import {
  WaitUntilOptions,
  defaultWaitUntilOptions,
  waitUntil,
  noWaitNoThrowOptions,
} from '../../utils';
import * as action from '../../actions';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api/playwright-fluent';
import { Frame, Page } from 'playwright';

export async function isReadOnly(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorReadOnly(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectReadOnly(selector, page, waitOptions);
    return result;
  }
}
async function expectThatCssSelectorIsReadOnly(
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
    () => isReadOnly(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }

      return `Selector '${selector}' is not read-only.`;
    },
    waitOptions,
  );
}
async function expectThatSelectorObjectIsReadOnly(
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
    () => isReadOnly(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }
      return `Selector '${selector.toString()}' is not read-only.`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorIsReadOnly(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsReadOnly(selector, page, options);
  }

  return await expectThatSelectorObjectIsReadOnly(selector, page, options);
}
