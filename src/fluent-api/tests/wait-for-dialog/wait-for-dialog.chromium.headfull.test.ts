import { PlaywrightFluent } from '../../playwright-fluent';
import path from 'path';
describe('Playwright Fluent - waitForDialog()', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait for dialog alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'wait-for-dialog-alert.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      // Then
      .expectThatDialog()
      .isOfType('alert', { timeoutInMilliseconds: 0 });
  });

  test('should wait for dialog confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'wait-for-dialog-confirm.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      // Then
      .expectThatDialog()
      .isOfType('confirm', { timeoutInMilliseconds: 0 });
  });

  test('should wait for dialog prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'wait-for-dialog-prompt.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      // Then
      .expectThatDialog()
      .isOfType('prompt', { timeoutInMilliseconds: 0 });
  });

  test('should assert that no subscription to page dialog events has been done - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'wait-for-dialog-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        //.WithDialogs() => withDialogs() is mandatory to use expectThatDialog()
        .navigateTo(url)
        // Then
        .waitForDialog({ timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "No dialog has been opened. Maybe you forgot to call the '.withDialogs()' on the playwright-fluent instance.",
    );
  });

  test('should wait for dialog prompt without throwing - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'wait-for-dialog-prompt.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      // .WithDialogs() => no dialog will be opened because no subscription to page dialog events has been done
      .navigateTo(url)
      .waitForDialog({ timeoutInMilliseconds: 1000, throwOnTimeout: false });

    // Then
    expect(p.isDialogOpened()).toBe(false);
    expect(p.isDialogClosed()).toBe(true);
  });
});
