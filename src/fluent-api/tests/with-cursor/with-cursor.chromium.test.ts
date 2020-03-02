import * as SUT from '../../playwright-fluent';
import * as action from '../../../actions';

describe('Playwright Fluent - withCursor', (): void => {
  let pwc: SUT.PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new SUT.PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should do nothing when browser is not launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc.withCursor();
    } catch (error) {
      result = error;
    }

    // Then
    expect(result).toBe(undefined);
  });

  test('should show cursor with chromium', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pwc
      .withBrowser('chromium')
      .withOptions({headless: true})
      .withCursor()
      .navigateTo(url);

    // Then
    const cursorExists = await action.exists('playwright-mouse-pointer', pwc.currentPage());
    expect(cursorExists).toBe(true);
  });
});
