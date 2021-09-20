import * as SUT from '../../playwright-fluent';
import * as path from 'path';
describe('Playwright Fluent - expect func resolves to', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });
  test('should wait until selector value has expected value - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-resolves-to.test.html')}`;
    const selector = p.selector('input').withValue('dynamically added');

    // When
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url);

    // Then
    await p.expectThatAsyncFunc(() => selector.value()).resolvesTo('I am dynamically added in DOM');
  });

  test('should wait until selector count is expected - chromium', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-resolves-to.test.html')}`;
    // prettier-ignore
    const selector = p
      .selector('[role="row"]')
      .find('td')
      .find('p');

    // When
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({ headless: false })
      .withCursor()
      .navigateTo(url);

    // Then
    await p.expectThatAsyncFunc(() => selector.count()).resolvesTo(6);
  });

  test('should give back an error when selector does not resolve to expected value', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'expect-resolves-to.test.html')}`;
    const selector = p.selector('foobar');

    // When
    let result: Error | undefined = undefined;
    try {
      await p
        .withBrowser('chromium')
        .withOptions({ headless: false })
        .withCursor()
        .navigateTo(url)
        .expectThatAsyncFunc(() => selector.count())
        .resolvesTo(1, { timeoutInMilliseconds: 1000 });
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "Async function did not have expected result '1', but instead it resolved to '0'",
    );
  });
});
