import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - typeText', (): void => {
  let pwc: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(60000);
    pwc = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should first click on an element - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    // const selector = 'foobar';

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .typeText('foobar');
    } catch (error) {
      result = error;
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
      await pwc
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .click(selector)
        .typeText('foobar');
    } catch (error) {
      result = error;
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
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .typeText('foobar');

    // Then
    const currentValue = await pwc.getValueOf(selector);
    expect(currentValue).toBe('foobar');
  });

  test('should type text in an input selector object - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'typetext.test.html')}`;
    const selector = pwc.selector('input').withValue('I am in viewport');

    // When
    await pwc
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url)
      .click(selector)
      .typeText('foobar');

    // Then
    const currentValue = await pwc.getValueOf('#in-view-port');
    expect(currentValue).toBe('foobar');
  });
});
