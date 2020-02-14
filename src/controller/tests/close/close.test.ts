import { PlaywrightController } from '../../controller';
import { sleep } from '../../../utils/sleep';
import { webkit } from 'playwright';
describe('Playwright Controller - close', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should close chromium', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const pwc = new PlaywrightController();

    // And
    await pwc.withBrowser(browser);
    let createdBrowser = pwc.currentBrowser();
    const previousConnectedStatus = createdBrowser && createdBrowser.isConnected();

    // When
    await pwc.close();

    // Then
    createdBrowser = pwc.currentBrowser();
    const currentConnectedStatus = createdBrowser && createdBrowser.isConnected();
    expect(createdBrowser).toBeDefined();
    expect(previousConnectedStatus).toBe(true);
    expect(currentConnectedStatus).toBe(false);
  });

  test('should close firefox', async (): Promise<void> => {
    // Given
    const browser = 'firefox';
    const pwc = new PlaywrightController();

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

  test('should close webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const pwc = new PlaywrightController();

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

  test('should do nothing when browser has not been launched', async (): Promise<void> => {
    // Given
    const pwc = new PlaywrightController();

    // When
    await pwc.close();

    // Then
    // no error should occur
  });

  test('should close webkit - playwright issue v0.11.0', async (): Promise<void> => {
    // Given
    const browser = await webkit.launch({ headless: false });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await page.goto('https://google.com');

    // When
    await sleep(1000);
    const previousConnectedStatus = browser.isConnected();
    await browser.close();
    await sleep(1000);
    const afterCloseConnectedStatus = browser.isConnected();

    // Then
    expect(browser).toBeDefined();
    expect(previousConnectedStatus).toBe(true);
    expect(afterCloseConnectedStatus).toBe(false);
  });
});
