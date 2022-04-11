import * as path from 'path';
import * as SUT from '../../playwright-fluent';
describe('Playwright Fluent - pasteText', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should first click on an element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    // const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .pasteText('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before pasting text',
    );
  });

  test('should first click on an editable element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    const selector = '#not-editable-content';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector)
        .pasteText('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before pasting text',
    );
  });

  test('should paste text in an input selector that has no paste event handler- chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    const selector = '#targetInput';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .pasteText('foobar', { handlePasteEvent: true });

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('foobar');
  });

  test('should paste text in a contenteditable selector that has no paste event handler- chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    const selector = 'p#target';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .pasteText('foobar', { handlePasteEvent: true });

    // Then
    const currentValue = await p.getInnerTextOf(selector);
    expect(currentValue).toBe('foobar');
  });

  test('should paste text in an input selector that has a paste event handler- chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    const selector = '#emptyInput';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .wait(1000)
      .pasteText('foobar');

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('FOOBAR');
  });

  test('should type text in an input selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'paste-text.test.html')}`;
    const selector = p.selector('input').withValue('paste your text');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .pasteText('foobar', { handlePasteEvent: true });

    // Then
    const currentValue = await p.getValueOf('#targetInput');
    expect(currentValue).toBe('foobar');
  });
});
