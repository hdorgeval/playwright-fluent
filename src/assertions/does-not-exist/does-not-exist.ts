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

export async function doesNotExist(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.selectorDoesNotExist(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.selectorObjectDoesNotExist(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorDoesNotExist(
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
    () => doesNotExist(selector, page, noWaitNoThrowOptions),
    `Selector '${selector}' was still found in DOM.`,
    waitOptions,
  );
}

async function expectThatSelectorObjectDoesNotExist(
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
    () => doesNotExist(selector, page, noWaitNoThrowOptions),
    `Selector '${selector.toString()}' was still found in DOM.`,
    waitOptions,
  );
}

export async function expectThatSelectorDoesNotExist(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorDoesNotExist(selector, page, options);
  }

  return await expectThatSelectorObjectDoesNotExist(selector, page, options);
}
