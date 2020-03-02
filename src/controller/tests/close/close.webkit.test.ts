import { PlaywrightFluent } from '../../controller';
import { sleep } from '../../../utils/sleep';
describe('Playwright Controller - close', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should close webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const pwc = new PlaywrightFluent();

    // And
    await pwc.withBrowser(browser);
    let createdBrowser = pwc.currentBrowser();
    const previousConnectedStatus = createdBrowser && createdBrowser.isConnected();

    // When
    await sleep(1000);
    await pwc.close();
    await sleep(1000);

    // Then
    createdBrowser = pwc.currentBrowser();
    const currentConnectedStatus = createdBrowser && createdBrowser.isConnected();
    expect(createdBrowser).toBeDefined();
    expect(previousConnectedStatus).toBe(true);
    expect(currentConnectedStatus).toBe(false);
  });
});
