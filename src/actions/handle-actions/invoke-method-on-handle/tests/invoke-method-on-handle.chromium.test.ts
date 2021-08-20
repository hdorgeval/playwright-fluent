import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';
import { isHandleChecked } from '../../is-handle-checked';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { hasHandleFocus } from '../../has-handle-focus';
import { MethodName } from '../index';
import { Browser, chromium } from 'playwright';
import * as path from 'path';

describe('invoke method on handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should invoke method click and focus on checkbox - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'invoke-method-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#unchecked-and-enabled';
    const handle = await page.$(selector);
    await SUT.invokeMethodOnHandle('click', handle, selector);
    await SUT.invokeMethodOnHandle('focus', handle, selector);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(true);
    expect(await isHandleChecked(handle, defaultVerboseOptions)).toBe(true);
  });

  test('should invoke method click/focus/blur on checkbox - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'invoke-method-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#unchecked-and-enabled';
    const handle = await page.$(selector);
    await SUT.invokeMethodOnHandle('click', handle, selector);
    await SUT.invokeMethodOnHandle('focus', handle, selector);
    await SUT.invokeMethodOnHandle('blur', handle, selector);

    // Then
    expect(handle).toBeDefined();
    expect(await hasHandleFocus(handle)).toBe(false);
    expect(await isHandleChecked(handle, defaultVerboseOptions)).toBe(true);
  });

  test('should throw when the method does not exist - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'invoke-method-on-handle.test.html')}`;
    await page.goto(url);

    // When
    const selector = '#unchecked-and-enabled';
    const handle = await page.$(selector);

    // Then
    const expectedError = new Error(
      "Cannot invoke method 'foo' on '#unchecked-and-enabled' because this method does not exist.",
    );

    await SUT.invokeMethodOnHandle('foo' as MethodName, handle, selector).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
