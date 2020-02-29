import * as SUT from '../../controller';
import * as path from 'path';
describe('Playwright Controller - click', (): void => {
  let pwc: SUT.PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new SUT.PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );
  test('should wait until selector is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector);

    // Then
    const value = await pwc.getValueOf(selector);
    expect(value).toBe('dynamically added input');
    const hasFocus = await pwc.hasFocus(selector);
    expect(hasFocus).toBe(true);
  });

  test('should wait until selector object is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = pwc.selector('input').withValue('dynamically added');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector);

    // Then
    const finalValue = await pwc.getValueOf('#dynamically-added-input');
    expect(finalValue).toBe('dynamically added input');
    const hasFocus = await pwc.hasFocus(selector);
    expect(hasFocus).toBe(true);
  });
  test('should not click on a non existing selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector, { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click on 'foobar' because selector was not found in DOM",
    );
  });

  test('should not click on a non existing selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = pwc.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector, { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click on 'selector(foobar)' because this selector was not found in DOM",
    );
  });
  test('should not click on a hidden selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = '#hidden';

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector, { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot hover on '#hidden' because this selector is not visible",
    );
  });

  test('should not click on a disabled selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = '#disabled';

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector, { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot click on '#disabled' because this selector is disabled",
    );
  });

  test('should not click on a disabled selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'click.test.html')}`;
    const selector = pwc.selector('input').withValue('I am disabled');

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector, { verbose: true, timeoutInMilliseconds: 2000 });
    } catch (error) {
      result = error;
    }

    // Then
    const errorMessage = `Cannot click on 'selector(input)
  .withValue(I am disabled)' because this selector is disabled`;
    expect(result && result.message).toContain(errorMessage);
  });

  test('should click - chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';
    const checkMeOut = pwc.selector('label').withText('Check me out');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .emulateDevice('iPhone 6 landscape')
      .navigateTo(url)
      .click(checkMeOut)
      .expectThat(checkMeOut.find('input'))
      .hasFocus();
  });
});
