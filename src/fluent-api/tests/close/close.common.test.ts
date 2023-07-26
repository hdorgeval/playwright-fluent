import { PlaywrightFluent } from '../../playwright-fluent';
describe('Playwright Fluent - close', (): void => {
  beforeEach((): void => {});

  test('should do nothing when browser has not been launched', async (): Promise<void> => {
    // Given
    const p = new PlaywrightFluent();

    // When
    await p.close();

    // Then
    // no error should occur
  });
});
