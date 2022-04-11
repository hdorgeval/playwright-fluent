import * as path from 'path';
import * as SUT from '../../playwright-fluent';
import { noWaitNoThrowOptions } from '../../../utils';
describe('Playwright Fluent - expectThat isEnabled with default assert options', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should wait until selector exists and is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'with-default-assert-options.test.html')}`;
    const selector = '#dynamically-added-input';

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .withDefaultAssertOptions({ stabilityInMilliseconds: 0, timeoutInMilliseconds: 10000 })
      .navigateTo(url)
      .expectThatSelector(selector)
      .isEnabled();

    // Then
    const isEnabled = await p.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });

  test('should wait until selector object exists and is enabled - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'with-default-assert-options.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withDefaultAssertOptions({ stabilityInMilliseconds: 0, timeoutInMilliseconds: 10000 })
      .withCursor()
      .navigateTo(url)
      .expectThatSelector(selector)
      .isEnabled();

    // Then
    const isEnabled = await p.isEnabled(selector, noWaitNoThrowOptions);
    expect(isEnabled).toBe(true);
  });
});
