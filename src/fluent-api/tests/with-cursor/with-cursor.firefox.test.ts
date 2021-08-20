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
  test('should show cursor with firefox', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await p
      .withBrowser('firefox')
      .withOptions({headless: true})
      .withCursor()
      .navigateTo(url);

    // Then
    const cursorExists = await action.exists('playwright-mouse-pointer', p.currentPage());
    expect(cursorExists).toBe(true);
  });
});
