import { PlaywrightFluent } from '../../playwright-fluent';
import path from 'path';
describe('Playwright Fluent - cancelDialog()', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should cancel dialog alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'cancel-dialog-alert.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      .expectThatDialog()
      .isOfType('alert')
      .cancelDialog();
    // Then
    // TODO: check if dialog is closed
  });

  test('should cancel dialog confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'cancel-dialog-confirm.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      .expectThatDialog()
      .isOfType('confirm')
      .cancelDialog();
    // Then
    // TODO: check if dialog is closed
  });

  test('should cancel dialog prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'cancel-dialog-prompt.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      .expectThatDialog()
      .isOfType('prompt')
      .cancelDialog();
    // Then
    // TODO: check if dialog is closed
  });

  test('should assert that no dialog has been opened - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'cancel-dialog-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        //.WithDialogs() => be sure that no dialog opens
        .navigateTo(url)
        // Then
        .cancelDialog();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot cancel dialog because no dialog has been opened',
    );
  });
});
