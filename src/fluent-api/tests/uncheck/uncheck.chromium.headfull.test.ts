import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - uncheck', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );
  test('should wait until selector is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .uncheck(selector);

    // Then
    const isUnchecked = await p.isUnchecked(selector);
    expect(isUnchecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isUnchecked();
  });

  test('should wait until selector object is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .uncheck(selector);

    // Then
    const isUnchecked = await selector.isUnchecked();
    expect(isUnchecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isUnchecked();
  });

  test('should do nothing when selector is already unchecked - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = '#unchecked-and-disabled';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .uncheck(selector);

    // Then
    const isUnchecked = await p.isUnchecked(selector);
    expect(isUnchecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isUnchecked();
  });

  test('should do nothing when selector object is already unchecked - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = p.selector('input').withValue('I am unchecked and disabled');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .uncheck(selector);

    // Then
    const isUnchecked = await selector.isUnchecked();
    expect(isUnchecked).toBe(true);

    // And
    await p.expectThatSelector(selector).isUnchecked();
  });
  test('should not uncheck a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .uncheck(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain("Selector 'foobar' was not found in DOM");
  });

  test('should not uncheck a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .uncheck(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot uncheck 'selector(foobar)' because this selector was not found in DOM",
    );
  });
  test('should not uncheck a hidden selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = '#hidden';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .uncheck(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot hover on '#hidden' because this selector is not visible",
    );
  });

  test('should not uncheck a disabled selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = '#disabled';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .uncheck(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot uncheck '#disabled' because this selector is disabled",
    );
  });

  test('should not uncheck a disabled selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'uncheck.test.html')}`;
    const selector = p.selector('input').withValue('I am disabled');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .uncheck(selector, { timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const errorMessage = `Cannot uncheck 'selector(input)
  .withValue(I am disabled)' because this selector is disabled`;
    expect(result && result.message).toContain(errorMessage);
  });

  test('should uncheck - chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    const checkMeOut = p.selector('label').withText('Check me out').find('input');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .check(checkMeOut)
      .expectThatSelector(checkMeOut)
      .isChecked()
      .uncheck(checkMeOut)
      .expectThatSelector(checkMeOut)
      .isUnchecked();

    // Then
    expect(await checkMeOut.isUnchecked()).toBe(true);
  });
});
