import * as SUT from '../../playwright-fluent';
import * as action from '../../../actions';

describe('Playwright Fluent - withCursor', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should do nothing when browser is not launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.withCursor();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result).toBe(undefined);
  });

  test('should show cursor with chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await p
      .withBrowser('chromium')
      .withOptions({headless: true})
      .withCursor()
      .navigateTo(url);

    // Then
    const cursorExists = await action.exists('playwright-mouse-pointer', p.currentPage());
    expect(cursorExists).toBe(true);
  });
});
