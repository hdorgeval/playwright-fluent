import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - check', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait until selector is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .check(selector);

    // Then
    const isChecked = await p.isChecked(selector);
    expect(isChecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isChecked();
  });

  test('should wait until selector object is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = p.selector('input#dynamically-added-input');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .check(selector);

    // Then
    await p.expectThatSelector(selector).isChecked();

    const isChecked = await selector.isChecked();
    expect(isChecked).toBe(true);
  });

  test('should do nothing when selector is already checked - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = '#checked-and-disabled';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .check(selector);

    // Then
    const isChecked = await p.isChecked(selector);
    expect(isChecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isChecked();
  });

  test('should do nothing when selector object is already checked - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = p.selector('input').withValue('I am checked and disabled');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .check(selector);

    // Then
    const isChecked = await selector.isChecked();
    expect(isChecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isChecked();
  });
  test('should not check a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .check(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM");
  });

  test('should not check a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .check(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check 'selector(foobar)' because this selector was not found in DOM",
    );
  });
  test('should not check a hidden selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = '#hidden';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .check(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot hover on '#hidden' because this selector is not visible",
    );
  });

  test('should not check a disabled selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = '#disabled';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .check(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot check '#disabled' because this selector is disabled",
    );
  });

  test('should not check a disabled selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'check.test.html')}`;
    const selector = p.selector('input').withValue('I am disabled');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .check(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    const errorMessage = `Cannot check 'selector(input)
  .withValue(I am disabled)' because this selector is disabled`;
    expect(result && result.message).toContain(errorMessage);
  });

  test('should check - chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/?path=/docs/components-forms--input';
    const checkMeOut = p.selector('label').withText('Check me out').parent().find('input');
    const storyBookIframe = 'iframe#storybook-preview-iframe';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .switchToIframe(storyBookIframe)
      .check(checkMeOut)
      .expectThatSelector(checkMeOut)
      .isChecked();

    // Then
    expect(await checkMeOut.isUnchecked()).toBe(false);
    expect(await checkMeOut.isChecked()).toBe(true);
  });
});
