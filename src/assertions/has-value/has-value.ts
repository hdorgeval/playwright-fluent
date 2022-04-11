import { Frame, Page } from 'playwright';
import { SelectorFluent } from '../../selector-api';
import {
  WaitUntilOptions,
  defaultWaitUntilOptions,
  waitUntil,
  noWaitNoThrowOptions,
  safeToString,
} from '../../utils';
import * as action from '../../actions';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';

export async function hasValue(
  selector: string | SelectorFluent,
  expectedValue: string,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasSelectorValue(selector, expectedValue, page, waitOptions);
    return result;
  }
  {
    const result = await action.hasSelectorObjectValue(selector, expectedValue, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorHasValue(
  selector: string,
  expectedValue: string,
  page: Page | Frame | undefined,
  options: AssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => hasValue(selector, expectedValue, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      const currentValue = await action.getValueOfSelector(selector, page, noWaitNoThrowOptions);
      return `Value of selector '${selector}' does not contain '${expectedValue}', but instead it contains '${safeToString(
        currentValue,
      )}'`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectHasValue(
  selector: SelectorFluent,
  expectedValue: string,
  page: Page | Frame | undefined,
  options: AssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => hasValue(selector, expectedValue, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }

      const currentValue = await selector.value();
      return `Value of '${selector.toString()}' does not contain '${expectedValue}', but instead it contains '${safeToString(
        currentValue,
      )}'`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorHasValue(
  selector: string | SelectorFluent,
  expectedValue: string,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    return await expectThatCssSelectorHasValue(selector, expectedValue, page, assertOptions);
  }

  return await expectThatSelectorObjectHasValue(selector, expectedValue, page, assertOptions);
}
