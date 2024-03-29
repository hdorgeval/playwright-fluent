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

export async function isNotVisible(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorNotVisible(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectNotVisible(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorIsNotVisible(
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
    () => isNotVisible(selector, page, noWaitNoThrowOptions),
    `Selector '${selector}' is visible.`,
    waitOptions,
  );
}

async function expectThatSelectorObjectIsNotVisible(
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
    () => isNotVisible(selector, page, noWaitNoThrowOptions),
    `Selector '${selector.toString()}' is visible.`,
    waitOptions,
  );
}

export async function expectThatSelectorIsNotVisible(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsNotVisible(selector, page, options);
  }

  return await expectThatSelectorObjectIsNotVisible(selector, page, options);
}
