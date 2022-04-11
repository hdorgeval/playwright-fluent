import path from 'path';
import { PlaywrightFluent } from '../../playwright-fluent';
describe('Playwright Fluent - expectThatDialog().hasValue(value)', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should assert dialog has value - alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-value-alert.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: true })
      .WithDialogs()
      .navigateTo(url)
      // Then
      .expectThatDialog()
      .isOfType('alert')
      // And
      .expectThatDialog()
      .hasValue('');
  });

  test('should assert dialog has value - confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-value-confirm.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: true })
      .WithDialogs()
      .navigateTo(url)
      // Then
      .expectThatDialog()
      .isOfType('confirm')
      // And
      .expectThatDialog()
      .hasValue('');
  });

  test('should assert dialog has value - prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-value-prompt.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: true })
      .WithDialogs()
      .navigateTo(url)
      // Then
      .expectThatDialog()
      .isOfType('prompt')
      // And
      .expectThatDialog()
      .hasValue('yes');
  });

  test('should assert wrong value on opened dialog - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-value-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: true })
        .WithDialogs()
        .navigateTo(url)
        // Then
        .expectThatDialog()
        .isOfType('prompt')
        // And
        .expectThatDialog()
        .hasValue('foobar', { timeoutInMilliseconds: 0 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Current dialog has value 'yes sure!' but it should be 'foobar'",
    );
  });

  test('should assert that no subscription to page dialog events has been done - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-value-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: true })
        //.WithDialogs() => no dialog will be opened
        .navigateTo(url)
        // Then
        .expectThatDialog()
        .hasValue('foobar', { timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.",
    );
  });
});
