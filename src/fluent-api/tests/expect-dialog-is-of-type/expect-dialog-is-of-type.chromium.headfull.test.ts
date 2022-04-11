import path from 'path';
import { DialogType, PlaywrightFluent } from '../../playwright-fluent';
describe('Playwright Fluent - expectThatDialog().isOfType(type)', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should assert dialog is alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-is-of-type-alert.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      // Then
      .expectThatDialog()
      .isOfType('alert');
  });

  test('should assert dialog is confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-is-of-type-confirm.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      // Then
      .expectThatDialog()
      .isOfType('confirm');
  });

  test('should assert dialog is prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-is-of-type-prompt.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      // Then
      .expectThatDialog()
      .isOfType('prompt');
  });

  test('should assert unknown type on opened dialog - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-is-of-type-prompt.test.html')}`;
    const unknownDialogType = 'foobar' as DialogType;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        .WithDialogs()
        .navigateTo(url)
        // Then
        .expectThatDialog()
        .isOfType(unknownDialogType, { timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Unknown dialog type: 'foobar'. It should be 'alert', 'confirm', 'prompt' or 'beforeunload'",
    );
  });

  test('should assert wrong type on opened dialog - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-is-of-type-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        .WithDialogs()
        .navigateTo(url)
        // Then
        .expectThatDialog()
        .isOfType('alert');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Current dialog is of type 'prompt' but it should be 'alert'",
    );
  });

  test('should assert that no subscription to page dialog events has been done - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-is-of-type-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        //.WithDialogs() => withDialogs() is mandatory to use expectThatDialog()
        .navigateTo(url)
        // Then
        .expectThatDialog()
        .isOfType('prompt', { timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.",
    );
  });
});
