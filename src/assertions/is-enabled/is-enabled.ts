import { SelectorFluent } from '../../selector-api';
import {
  WaitUntilOptions,
  defaultWaitUntilOptions,
  waitUntil,
  noWaitNoThrowOptions,
} from '../../utils';
import * as action from '../../actions';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import { Page } from 'playwright';

export async function isEnabled(
  selector: string | SelectorFluent,
  page: Page | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorEnabled(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectEnabled(selector, page, waitOptions);
    return result;
  }
}
async function expectThatCssSelectorIsEnabled(
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
    () => isEnabled(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }

      return `Selector '${selector}' is disabled.`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectIsEnabled(
  selector: SelectorFluent,
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
    () => isEnabled(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }
      return `Selector '${selector.toString()}' is disabled.`;
    },
    waitOptions,
  );
}
export async function expectThatSelectorIsEnabled(
  selector: string | SelectorFluent,
  page: Page | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsEnabled(selector, page, options);
  }

  return await expectThatSelectorObjectIsEnabled(selector, page, options);
}
