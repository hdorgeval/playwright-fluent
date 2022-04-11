import path from 'path';
import { PlaywrightFluent } from '../../playwright-fluent';
describe('Playwright Fluent - typeTextInDialogAndSubmit()', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should type text and submit dialog prompt - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'typetext-in-dialog-and-submit-prompt.test.html')}`;
    const answerSelector = '#answer';

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: true })
      .WithDialogs()
      .navigateTo(url)
      .expectThat(answerSelector)
      .hasValue('waiting for your answer ...')
      .waitForDialog()
      .expectThatDialog()
      .isOfType('prompt')
      .expectThatDialog()
      .hasMessage('yo?')
      .expectThatDialog()
      .hasValue('yes')
      .typeTextInDialogAndSubmit('foobar')
      // Then
      .expectThat(answerSelector)
      .hasValue('foobar');
  });

  test('should assert that no dialog has been opened - chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = `file:${path.join(__dirname, 'typetext-in-dialog-and-submit-prompt.test.html')}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser(browser)
        .withOptions({ headless: true })
        //.WithDialogs() => be sure that no dialog opens
        .navigateTo(url)
        // Then
        .typeTextInDialogAndSubmit('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot accept dialog because no dialog has been opened',
    );
  });
});
