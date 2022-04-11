import path from 'path';
import { PlaywrightFluent } from '../../playwright-fluent';
describe('Playwright Fluent - expectThatDialog().hasMessage(message)', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should assert dialog has message alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-message-alert.test.html')}`;

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
      .hasMessage('alert');
  });

  test('should assert dialog has message confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-message-confirm.test.html')}`;

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
      .hasMessage('confirm');
  });

  test('should assert dialog has message prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-message-prompt.test.html')}`;

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
      .hasMessage('prompt');
  });

  test('should assert wrong message on opened dialog - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-message-prompt.test.html')}`;

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
        .hasMessage('yo! this is an alert!', { timeoutInMilliseconds: 0 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Current dialog has message 'yo! please prompt!' but it should be 'yo! this is an alert!'",
    );
  });

  test('should assert that no subscription to page dialog events has been done - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'expect-dialog-has-message-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: true })
        //.WithDialogs() => withDialogs() is mandatory to use expectThatDialog()
        .navigateTo(url)
        // Then
        .expectThatDialog()
        .hasMessage('prompt', { timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.",
    );
  });
});
