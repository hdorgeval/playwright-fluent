import { PlaywrightFluent } from '../../playwright-fluent';
import { fileExists } from '../../../utils';
import path from 'path';
describe('Playwright Fluent - withTracing()', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    p = new PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should trace with chromium in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const tracePath = path.join(__dirname, 'trace1.zip');
    expect(fileExists(tracePath)).toBe(false);

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .withTracing()
      .startTracing({ title: 'my first trace' })
      .navigateTo(url)
      .stopTracingAndSaveTrace({ path: tracePath })
      .waitUntil(async () => fileExists(tracePath), {
        throwOnTimeout: false,
        wrapPredicateExecutionInsideTryCatch: true,
      });

    // Then
    expect(fileExists(tracePath)).toBe(true);
  });
});
