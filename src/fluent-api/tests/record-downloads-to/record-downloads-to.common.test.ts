import { userDownloadsDirectory } from '../../../utils';
import * as SUT from '../../playwright-fluent';

describe('Playwright Fluent - recordDownloadsTo(directory)', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      // eslint-disable-next-line no-console
      console.log(`User downloads directory : '${userDownloadsDirectory}'`);
      await p.recordDownloadsTo(userDownloadsDirectory);
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `Cannot record downloads to '${userDownloadsDirectory}' because no browser has been launched`,
    );
  });
});
