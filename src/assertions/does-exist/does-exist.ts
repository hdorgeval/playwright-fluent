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

export async function doesExist(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.selectorExists(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.selectorObjectExists(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorDoesExist(
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
    () => doesExist(selector, page, noWaitNoThrowOptions),
    `Selector '${selector}' was not found in DOM.`,
    waitOptions,
  );
}

async function expectThatSelectorObjectDoesExist(
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
    () => doesExist(selector, page, noWaitNoThrowOptions),
    `Selector '${selector.toString()}' was not found in DOM.`,
    waitOptions,
  );
}

export async function expectThatSelectorDoesExist(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorDoesExist(selector, page, options);
  }

  return await expectThatSelectorObjectDoesExist(selector, page, options);
}
