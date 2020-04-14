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

export async function isChecked(
  selector: string | SelectorFluent,
  page: Page | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorChecked(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectChecked(selector, page, waitOptions);
    return result;
  }
}
async function expectThatCssSelectorIsChecked(
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
    () => isChecked(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }

      return `Selector '${selector}' is unchecked.`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectIsChecked(
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
    () => isChecked(selector, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }
      return `Selector '${selector.toString()}' is unchecked.`;
    },
    waitOptions,
  );
}
export async function expectThatSelectorIsChecked(
  selector: string | SelectorFluent,
  page: Page | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsChecked(selector, page, options);
  }

  return await expectThatSelectorObjectIsChecked(selector, page, options);
}
