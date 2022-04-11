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

export async function isNotVisibleInViewport(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.isSelectorNotVisibleInViewport(selector, page, waitOptions);
    return result;
  }
  {
    const result = await action.isSelectorObjectNotVisibleInViewport(selector, page, waitOptions);
    return result;
  }
}

async function expectThatCssSelectorIsNotVisibleInViewport(
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
    () => isNotVisibleInViewport(selector, page, noWaitNoThrowOptions),
    `Selector '${selector}' is visible in the current viewport.`,
    waitOptions,
  );
}

async function expectThatSelectorObjectIsNotVisibleInViewport(
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
    () => isNotVisibleInViewport(selector, page, noWaitNoThrowOptions),
    `Selector '${selector.toString()}' is visible in the current viewport.`,
    waitOptions,
  );
}

export async function expectThatSelectorIsNotVisibleInViewport(
  selector: string | SelectorFluent,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  if (typeof selector === 'string') {
    return await expectThatCssSelectorIsNotVisibleInViewport(selector, page, options);
  }

  return await expectThatSelectorObjectIsNotVisibleInViewport(selector, page, options);
}
