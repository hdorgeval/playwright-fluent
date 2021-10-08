import { PlaywrightFluent } from '../../playwright-fluent';
import path from 'path';
describe('Playwright Fluent - acceptDialog()', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should accept dialog alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'accept-dialog-alert.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      .expectThatDialog()
      .isOfType('alert')
      .acceptDialog();

    // Then
    expect(p.isDialogOpened()).toBe(false);
    expect(p.isDialogClosed()).toBe(true);
  });

  test('should accept dialog confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'accept-dialog-confirm.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      .expectThatDialog()
      .isOfType('confirm')
      .acceptDialog();

    // Then
    expect(p.isDialogOpened()).toBe(false);
    expect(p.isDialogClosed()).toBe(true);
  });

  test('should accept dialog prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'accept-dialog-prompt.test.html')}`;

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .WithDialogs()
      .navigateTo(url)
      .waitForDialog()
      .expectThatDialog()
      .isOfType('prompt')
      .acceptDialog();

    // Then
    expect(p.isDialogOpened()).toBe(false);
    expect(p.isDialogClosed()).toBe(true);
  });

  test('should assert that no dialog has been opened - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'accept-dialog-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        //.WithDialogs() => be sure that no dialog opens
        .navigateTo(url)
        // Then
        .acceptDialog();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot accept dialog because no dialog has been opened',
    );
  });
});
