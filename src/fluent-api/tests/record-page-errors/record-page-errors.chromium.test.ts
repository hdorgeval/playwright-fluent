import * as SUT from '../../playwright-fluent';
import * as path from 'path';

describe('Playwright Fluent - recordPageErrors', (): void => {
  let p: SUT.PlaywrightFluent;

  beforeEach((): void => {
    jest.setTimeout(30000);
    p = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should record uncaught exception and console.error logs', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-page-errors.test.html')}`;

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .recordPageErrors()
      .navigateTo(url);

    await p.waitForStabilityOf(async () => p.getPageErrors().length, {
      stabilityInMilliseconds: 1000,
    });

    // Then
    const result = p.getPageErrors();

    expect(result.length).toBe(4);
    expect(result[0].message).toContain('Error#1');
    expect(result[1].message).toContain('console error');
    expect(result[2].message).toContain('Error#2');
    expect(result[3].message).toContain('Error#3');

    p.clearPageErrors();
    expect(p.getPageErrors().length).toBe(0);
  });
});
