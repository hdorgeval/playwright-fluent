import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - typeText', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should first click on an element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    // const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .typeText('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before typing text',
    );
  });

  test('should first click on an editable element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
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
        .typeText('foobar');
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'You must first click on an editable element before typing text',
    );
  });

  test('should type text in an input selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    const selector = '#in-view-port';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .typeText('foobar');

    // Then
    const currentValue = await p.getValueOf(selector);
    expect(currentValue).toBe('foobar');
  });

  test('should clear text before typing in an input selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    const selector = p.selector('input').withValue('I am in viewport');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .typeText('foobar');

    // Then
    const currentValue = await p.getValueOf('#in-view-port');
    expect(currentValue).toBe('foobar');
  });

  test('should type text in an empty input selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    const selector = p.selector('input#in-view-port-and-empty');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .typeText('foobar');

    // Then
    const currentValue = await p.getValueOf('#in-view-port-and-empty');
    expect(currentValue).toBe('foobar');
  });

  test('should type text in an editable selector - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    const selector = 'p#editable-content';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .typeText('foobar');

    // Then
    const currentValue = await p.getInnerTextOf(selector);
    expect(currentValue).toBe('foobar');
  });
});
