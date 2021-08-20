import { passthroughMock } from '../../../actions';
import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - withMocks()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const mocks = [passthroughMock];
    // When
    let result: Error | undefined = undefined;
    try {
      // prettier-ignore
      await p.withMocks(mocks);
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      'Cannot intercept requests with mocks because no browser has been launched',
    );
  });
});
