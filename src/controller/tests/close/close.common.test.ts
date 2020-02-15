import { PlaywrightController } from '../../controller';
describe('Playwright Controller - close', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should do nothing when browser has not been launched', async (): Promise<void> => {
    // Given
    const pwc = new PlaywrightController();

    // When
    await pwc.close();

    // Then
    // no error should occur
  });
});
