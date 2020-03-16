import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - clearText', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should first click on an element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    // const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .clearText();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before clearing text',
    );
  });

  test('should first click on an editable element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
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
        .clearText();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before clearing text',
    );
  });
  test('should raise an error when clicked div is not editable - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    const selector = '#content-not-editable-div';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector)
        .clearText();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before clearing text',
    );
  });

  test('should clear text in an input selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    const selector = '#in-view-port';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .clearText();

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('');
  });

  test('should clear text in an input selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    const selector = p.selector('input').withValue('I am in viewport');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .clearText();

    // Then
    const currentValue = await p.getValueOf('#in-view-port');
    expect(currentValue).toBe('');
  });
  test('should clear text in a contenteditable selector object - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    const selector = p.selector('p').withText('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .clearText();

    // Then
    const currentText = await p.getInnerTextOf('p#dynamically-added');
    expect(currentText).toBe('');
  });

  test('should clear text in a contenteditable div selector object - chromium', async (): Promise<
    void
  > => {
    // Given
    const url = `file:${path.join(__dirname, 'clear-text.test.html')}`;
    const selector = p.selector('div[contenteditable="true"]').withText('editable div');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .clearText();

    // Then
    const currentText = await p.getInnerTextOf('div#content-editable-div');
    expect(currentText).toBe('');
  });
});
