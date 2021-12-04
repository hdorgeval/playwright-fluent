import * as SUT from '../../playwright-fluent';
import path from 'path';

describe('Playwright Fluent - withTracing()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return an error when startTracing() is called before withTracing()', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const tracePath = path.join(__dirname, 'trace1.chromium.zip');

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        //.withTracing()
        .startTracing({ title: 'my first trace' })
        .navigateTo(url)
        .stopTracingAndSaveTrace({ path: tracePath });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot start Tracing because Tracing is not enabled. Maybe you forgot to call the withTrace(options)',
    );
  });

  test('should return an error when stopTracing() is called before withTracing()', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const tracePath = path.join(__dirname, 'trace1.chromium.zip');

    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await p
        .withBrowser(browser)
        .withOptions({ headless: false })
        //.withTracing()
        //.startTracing({ title: 'my first trace' })
        .navigateTo(url)
        .stopTracingAndSaveTrace({ path: tracePath });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot stop Tracing and save trace file because Tracing is not enabled. Maybe you forgot to call the withTrace(options)',
    );
  });
});
