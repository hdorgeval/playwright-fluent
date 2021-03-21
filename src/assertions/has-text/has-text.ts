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
import { Frame, Page } from 'playwright';

export async function hasText(
  selector: string | SelectorFluent,
  expectedText: string,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasSelectorText(selector, expectedText, page, waitOptions);
    return result;
  }
  {
    const result = await action.hasSelectorObjectText(selector, expectedText, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorHasText(
  selector: string,
  expectedText: string,
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
    () => hasText(selector, expectedText, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      const currentInnerText = await action.getInnerTextOfSelector(
        selector,
        page,
        noWaitNoThrowOptions,
      );
      return `Inner text of selector '${selector}' does not contain '${expectedText}', but instead it contains '${safeToString(
        currentInnerText,
      )}'`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectHasText(
  selector: SelectorFluent,
  expectedText: string,
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
    () => hasText(selector, expectedText, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }

      const currentInnerText = await selector.innerText();
      return `Inner text of '${selector.toString()}' does not contain '${expectedText}', but instead it contains '${safeToString(
        currentInnerText,
      )}'`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorHasText(
  selector: string | SelectorFluent,
  expectedText: string,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    return await expectThatCssSelectorHasText(selector, expectedText, page, assertOptions);
  }

  return await expectThatSelectorObjectHasText(selector, expectedText, page, assertOptions);
}
