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

export async function hasAttributeWithValue(
  selector: string | SelectorFluent,
  attributeName: string,
  expectedAttributeValue: string,
  page: Page | Frame | undefined,
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<boolean> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    const result = await action.hasSelectorAttribute(
      selector,
      attributeName,
      expectedAttributeValue,
      page,
      waitOptions,
    );
    return result;
  }
  {
    const result = await action.hasSelectorObjectAttribute(
      selector,
      attributeName,
      expectedAttributeValue,
      page,
      waitOptions,
    );
    return result;
  }
}

async function expectThatCssSelectorHasAttributeWithValue(
  selector: string,
  attributeName: string,
  expectedAttributeValue: string,
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
    () =>
      hasAttributeWithValue(
        selector,
        attributeName,
        expectedAttributeValue,
        page,
        noWaitNoThrowOptions,
      ),
    async (): Promise<string> => {
      const exists = await action.exists(selector, page);
      if (!exists) {
        return `Selector '${selector}' was not found in DOM.`;
      }
      const currentAttributeValue = await action.getAttributeOfSelector(
        selector,
        attributeName,
        page,
        noWaitNoThrowOptions,
      );

      if (currentAttributeValue === null) {
        return `Selector '${selector}' does not have attribute '${attributeName}' with value '${expectedAttributeValue}', because no attribute with this name has been found on the selector`;
      }

      return `Selector '${selector}' does not have attribute '${attributeName}' with value '${expectedAttributeValue}', but instead the attribute value is '${currentAttributeValue}'`;
    },
    waitOptions,
  );
}

async function expectThatSelectorObjectHasAttributeWithValue(
  selector: SelectorFluent,
  attributeName: string,
  expectedAttributeValue: string,
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
    () =>
      hasAttributeWithValue(
        selector,
        attributeName,
        expectedAttributeValue,
        page,
        noWaitNoThrowOptions,
      ),
    async (): Promise<string> => {
      const exists = await selector.exists();
      if (!exists) {
        return `Selector '${selector.toString()}' was not found in DOM.`;
      }

      const currentAttributeValue = await selector.getAttribute(attributeName);

      if (currentAttributeValue === null) {
        return `'${selector.toString()}' does not have attribute '${attributeName}' with value '${expectedAttributeValue}', because no attribute with this name has been found on the selector`;
      }

      return `'${selector.toString()}' does not have attribute '${attributeName}' with value '${expectedAttributeValue}', but instead the attribute value is '${currentAttributeValue}'`;
    },
    waitOptions,
  );
}

export async function expectThatSelectorHasAttributeWithValue(
  selector: string | SelectorFluent,
  attributeName: string,
  expectedAttributeValue: string,
  page: Page | Frame | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };
  if (typeof selector === 'string') {
    return await expectThatCssSelectorHasAttributeWithValue(
      selector,
      attributeName,
      expectedAttributeValue,
      page,
      assertOptions,
    );
  }

  return await expectThatSelectorObjectHasAttributeWithValue(
    selector,
    attributeName,
    expectedAttributeValue,
    page,
    assertOptions,
  );
}
