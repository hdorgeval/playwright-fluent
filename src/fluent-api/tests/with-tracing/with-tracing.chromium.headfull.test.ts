import path from 'path';
import { PlaywrightFluent } from '../../playwright-fluent';
import { fileExists } from '../../../utils';
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
    const tracePath = path.join(__dirname, 'trace1.chromium.zip');
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

  test('should handle multiple traces with chromium in headfull mode', async (): Promise<void> => {
    // Given
    const browser = 'chromium';
    const url = 'https://reactstrap.github.io';
    const firstTracePath = path.join(__dirname, 'trace01.chromium.zip');
    expect(fileExists(firstTracePath)).toBe(false);

    const secondTracePath = path.join(__dirname, 'trace02.chromium.zip');
    expect(fileExists(secondTracePath)).toBe(false);

    const componentsTree = 'div#components';

    const formsComponents = p
      .selector('div#storybook-explorer-tree')
      .find('button')
      .withText('Forms');
    const storyBookIframe = 'iframe#storybook-preview-iframe';
    const checkMeOut = p.selector('label').withText('Check me out').parent().find('input');

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .withTracing()
      .withCursor()
      .startTracing({ title: 'my first trace' })
      .navigateTo(url)
      .stopTracingAndSaveTrace({ path: firstTracePath })
      .startTracing({ title: 'my second trace' })
      .hover(componentsTree)
      .hover(formsComponents)
      .click(formsComponents)
      .switchToIframe(storyBookIframe)
      .check(checkMeOut)
      .expectThatSelector(checkMeOut)
      .isChecked()
      .stopTracingAndSaveTrace({ path: secondTracePath })
      .waitUntil(async () => fileExists(secondTracePath), {
        throwOnTimeout: false,
        wrapPredicateExecutionInsideTryCatch: true,
      });

    // Then
    expect(fileExists(firstTracePath)).toBe(true);
    expect(fileExists(secondTracePath)).toBe(true);
  });
});
