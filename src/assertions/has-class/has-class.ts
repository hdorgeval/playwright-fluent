import { Frame, Page } from 'playwright';
import { SelectorFluent } from '../../selector-api';
import {
  WaitUntilOptions,
  defaultWaitUntilOptions,
  waitUntil,
  noWaitNoThrowOptions,
} from '../../utils';
import * as action from '../../actions';
import { AssertOptions, defaultAssertOptions } from '../../fluent-api';

export async function hasClass(
  selector: string | SelectorFluent,
  expectedClass: string,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasSelectorClass(selector, expectedClass, page, waitOptions);
    return result;
  }
  {
    const result = await action.hasSelectorObjectClass(selector, expectedClass, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorHasClass(
  selector: string,
  expectedClass: string,
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
    () => hasClass(selector, expectedClass, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      const currentClassList = await action.getClassListOfSelector(
        selector,
        page,
        noWaitNoThrowOptions,
      );

      if (Array.isArray(currentClassList) && currentClassList.length === 0) {
        return `Selector '${selector}' does not have class '${expectedClass}', because no class has been found on the selector`;
      }

      return `Selector '${selector}' does not have class '${expectedClass}', but instead has classes '${currentClassList}'`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectHasClass(
  selector: SelectorFluent,
  expectedClass: string,
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
    () => hasClass(selector, expectedClass, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }

      const currentClassList = await selector.classList();
      if (Array.isArray(currentClassList) && currentClassList.length === 0) {
        return `'${selector.toString()}' does not have class '${expectedClass}', because no class has been found on the selector`;
      }

      return `'${selector.toString()}' does not have class '${expectedClass}', but instead has classes '${currentClassList}'`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorHasClass(
  selector: string | SelectorFluent,
  expectedClass: string,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    return await expectThatCssSelectorHasClass(selector, expectedClass, page, assertOptions);
  }

  return await expectThatSelectorObjectHasClass(selector, expectedClass, page, assertOptions);
}
