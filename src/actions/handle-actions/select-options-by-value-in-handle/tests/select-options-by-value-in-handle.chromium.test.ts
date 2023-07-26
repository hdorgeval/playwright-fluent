import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { getAllOptionsOfHandle } from '../../get-all-options-of-handle';
import { defaultSelectOptions } from '../../select-options-in-handle';

describe('select options by value in handle', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should throw when selector is not a select - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(
      __dirname,
      'select-options-by-value-in-handle.common.test.html',
    )}`;
    await page.goto(url);

    const selector = '#empty-input';
    const handle = await page.$(selector);

    // When
    // Then
    const expectedError = new Error("Cannot find any options in selector '#empty-input'");

    await SUT.selectOptionsByValueInHandle(
      handle,
      selector,
      ['foobar'],
      page,
      defaultSelectOptions,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should throw when select is disabled - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(
      __dirname,
      'select-options-by-value-in-handle.common.test.html',
    )}`;
    await page.goto(url);

    const selector = '#disabled-select';
    const handle = await page.$(selector);

    // When
    // Then
    const expectedError = new Error(
      "Cannot select options 'value 1' in '#disabled-select' because this selector is disabled",
    );

    await SUT.selectOptionsByValueInHandle(handle, selector, ['value 1'], page, {
      ...defaultSelectOptions,
      timeoutInMilliseconds: 2000,
    }).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should throw when option is unknown - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(
      __dirname,
      'select-options-by-value-in-handle.common.test.html',
    )}`;
    await page.goto(url);

    const selector = '#enabled-select';
    const handle = await page.$(selector);

    // When
    // Then
    const expectedError = new Error(
      "Cannot select options 'foobar' in '#enabled-select' because this selector has only options ',value 1,value 2'",
    );

    await SUT.selectOptionsByValueInHandle(handle, selector, ['foobar'], page, {
      ...defaultSelectOptions,
      timeoutInMilliseconds: 2000,
    }).catch((error): void => expect(error).toMatchObject(expectedError));
  });

  test('should not throw when options are already selected in a disabled select - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(
      __dirname,
      'select-options-by-value-in-handle.common.test.html',
    )}`;
    await page.goto(url);

    // When
    const selector = '#disabled-select';
    const values = ['value 2', 'value 3'];
    const handle = await page.$(selector);
    await SUT.selectOptionsByValueInHandle(handle, selector, values, page, defaultSelectOptions);

    // Then
    expect(true).toBe(true);
  });

  test('should select option - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(
      __dirname,
      'select-options-by-value-in-handle.common.test.html',
    )}`;
    await page.goto(url);

    // When
    const selector = '#enabled-select';
    const values = ['value 1'];
    const handle = await page.$(selector);
    await SUT.selectOptionsByValueInHandle(handle, selector, values, page, defaultSelectOptions);

    // Then
    const options = await getAllOptionsOfHandle(handle, selector);
    const selectedOption = options.find((o) => o.selected);

    expect(selectedOption!.value).toBe('value 1');
  });

  test('should select multiple options - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    const url = `file:${path.join(
      __dirname,
      'select-options-by-value-in-handle.common.test.html',
    )}`;
    await page.goto(url);

    // When
    const selector = '#multiple-select';
    const labels = ['value 1', 'value 2'];
    const handle = await page.$(selector);
    const optionsBefore = await getAllOptionsOfHandle(handle, selector);
    await SUT.selectOptionsByValueInHandle(handle, selector, labels, page, defaultSelectOptions);

    // Then
    const optionsAfter = await getAllOptionsOfHandle(handle, selector);
    const selectedOptionsBefore = optionsBefore.filter((o) => o.selected).map((o) => o.value);
    const selectedOptionsAfter = optionsAfter.filter((o) => o.selected).map((o) => o.value);
    expect(`${selectedOptionsBefore}`).toBe('value 2,value 3');
    expect(`${selectedOptionsAfter}`).toBe('value 1,value 2');
  });
});
