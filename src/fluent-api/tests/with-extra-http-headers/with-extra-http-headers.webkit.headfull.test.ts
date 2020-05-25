import { PlaywrightFluent } from '../../playwright-fluent';
import { toRequestInfo } from '../../../utils';
declare const window: Window;
describe('Playwright Fluent - withExtraHttpHeaders', (): void => {
  let p: PlaywrightFluent;
  beforeEach((): void => {
    jest.setTimeout(70000);
    p = new PlaywrightFluent();
  });
  afterEach(
    async (): Promise<void> => {
      await p.close();
    },
  );

  test('should set headers - webkit', async (): Promise<void> => {
    // Given
    const browser = 'webkit';
    const url = 'https://reactstrap.github.io';

    // When
    await p
      .withBrowser(browser)
      .withOptions({ headless: false })
      .withExtraHttpHeaders({ 'X-FOO': 'false', 'X-BAR': 'true' })
      .recordRequestsTo('/reactstrap.github.io')
      .navigateTo(url);

    // Then
    const requests = await p.getRecordedRequestsTo(url);
    const firstRequest = requests[0];
    const request = await toRequestInfo(firstRequest);

    expect(request.headers).toMatchObject({ 'x-foo': 'false', 'x-bar': 'true' });
  });
});
