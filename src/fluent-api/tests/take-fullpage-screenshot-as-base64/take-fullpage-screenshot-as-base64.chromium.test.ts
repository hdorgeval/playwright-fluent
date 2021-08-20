import * as SUT from '../../playwright-fluent';
import * as path from 'path';

describe('Playwright Fluent - takeFullPageScreenshotAsBase64', (): void => {
  let p: SUT.PlaywrightFluent;

  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should take screenshot', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'take-fullpage-screenshot-as-base64.test.html')}`;

    // When
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .navigateTo(url);

    const screenshot = await p.takeFullPageScreenshotAsBase64();

    // Then
    expect(typeof screenshot).toBe('string');
    expect(screenshot.startsWith('iVBOR')).toBe(true);
    expect(screenshot.endsWith('==') || screenshot.endsWith('CYII=')).toBe(true);
  });
});
