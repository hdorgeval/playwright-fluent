import { PlaywrightFluent } from '../../playwright-fluent';
import path from 'path';
describe('Playwright Fluent - withDialogs', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should record page dialogs - alert - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'with-dialogs-alert.test.html')}`;

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

  test('should record page dialogs - confirm - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'with-dialogs-confirm.test.html')}`;

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

  test('should record page dialogs - prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'with-dialogs-prompt.test.html')}`;

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
});
