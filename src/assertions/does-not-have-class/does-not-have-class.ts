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

export async function doesNotHaveClass(
  selector: string | SelectorFluent,
  expectedClass: string,
  page: Page | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasNotSelectorClass(selector, expectedClass, page, waitOptions);
    return result;
  }
  {
    const result = await action.hasNotSelectorObjectClass(
      selector,
      expectedClass,
      page,
      waitOptions,
    );
    return result;
  }
}

async function expectThatCssSelectorDoesNotHaveClass(
  selector: string,
  expectedClass: string,
  page: Page | undefined,
  options: AssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => doesNotHaveClass(selector, expectedClass, page, noWaitNoThrowOptions),
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

      return `Selector '${selector}' has classes '${currentClassList}', but it should not have class '${expectedClass}'`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectDoesNotHaveClass(
  selector: SelectorFluent,
  expectedClass: string,
  page: Page | undefined,
  options: AssertOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...defaultAssertOptions,
    ...options,
    throwOnTimeout: true,
  };

  await waitUntil(
    () => doesNotHaveClass(selector, expectedClass, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }

      const currentClassList = await selector.classList();

      return `'${selector.toString()}' has classes '${currentClassList}', but it should not have class '${expectedClass}'`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorDoesNotHaveClass(
  selector: string | SelectorFluent,
  expectedClass: string,
  page: Page | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    return await expectThatCssSelectorDoesNotHaveClass(
      selector,
      expectedClass,
      page,
      assertOptions,
    );
  }

  return await expectThatSelectorObjectDoesNotHaveClass(
    selector,
    expectedClass,
    page,
    assertOptions,
  );
}
