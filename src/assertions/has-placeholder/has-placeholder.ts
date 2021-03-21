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

export async function hasPlaceholder(
  selector: string | SelectorFluent,
  expectedPlaceholder: string,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasSelectorPlaceholder(
      selector,
      expectedPlaceholder,
      page,
      waitOptions,
    );
    return result;
  }
  {
    const result = await action.hasSelectorObjectPlaceholder(
      selector,
      expectedPlaceholder,
      page,
      waitOptions,
    );
    return result;
  }
}

async function expectThatCssSelectorHasPlaceholder(
  selector: string,
  expectedPlaceholder: string,
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
    () => hasPlaceholder(selector, expectedPlaceholder, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      const currentPlaceholder = await action.getAttributeOfSelector(
        selector,
        'placeholder',
        page,
        noWaitNoThrowOptions,
      );

      if (currentPlaceholder === null) {
        return `Selector '${selector}' does not have placeholder '${expectedPlaceholder}', because no placeholder has been found on the selector`;
      }

      return `Selector '${selector}' does not have placeholder '${expectedPlaceholder}', but instead has placeholder '${currentPlaceholder}'`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectHasPlaceholder(
  selector: SelectorFluent,
  expectedPlaceholder: string,
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
    () => hasPlaceholder(selector, expectedPlaceholder, page, noWaitNoThrowOptions),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }

      const currentPlaceholder = await selector.placeholder();

      if (currentPlaceholder === null) {
        return `'${selector.toString()}' does not have placeholder '${expectedPlaceholder}', because no placeholder has been found on the selector`;
      }

      return `'${selector.toString()}' does not have placeholder '${expectedPlaceholder}', but instead has placeholder '${currentPlaceholder}'`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorHasPlaceholder(
  selector: string | SelectorFluent,
  expectedPlaceholder: string,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    return await expectThatCssSelectorHasPlaceholder(
      selector,
      expectedPlaceholder,
      page,
      assertOptions,
    );
  }

  return await expectThatSelectorObjectHasPlaceholder(
    selector,
    expectedPlaceholder,
    page,
    assertOptions,
  );
}
