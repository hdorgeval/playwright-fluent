import { PlaywrightFluent } from '../../playwright-fluent';
import { sleep } from '../../../utils/sleep';
describe('Playwright Fluent - close', (): void => {
  beforeEach((): void => {});

  test('should close webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const p = new PlaywrightFluent();

    // And
    await p.withBrowser(browser);
    let createdBrowser = p.currentBrowser();
    const previousConnectedStatus = createdBrowser && createdBrowser.isConnected();

    // When
    await sleep(1000);
    await p.close();
    await sleep(1000);

    // Then
    createdBrowser = p.currentBrowser();
    const currentConnectedStatus = createdBrowser && createdBrowser.isConnected();
    expect(createdBrowser).toBeDefined();
    expect(previousConnectedStatus).toBe(true);
    expect(currentConnectedStatus).toBe(false);
  });
});
