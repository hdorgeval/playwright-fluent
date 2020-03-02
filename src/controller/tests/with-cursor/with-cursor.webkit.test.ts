import * as SUT from '../../controller';
import * as action from '../../../actions';

describe('Playwright Controller - withCursor', (): void => {
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
  test('should show cursor with webkit', async (): Promise<void> => {
    // Given
    const url = 'https://reactstrap.github.io/components/form';

    // When
    // prettier-ignore
    await pwc
      .withBrowser('webkit')
      .withOptions({headless: true})
      .withCursor()
      .navigateTo(url);

    // Then
    const cursorExists = await action.exists('playwright-mouse-pointer', pwc.currentPage());
    expect(cursorExists).toBe(true);
  });
});
