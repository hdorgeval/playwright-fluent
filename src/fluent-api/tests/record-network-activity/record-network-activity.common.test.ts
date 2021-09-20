import { uniqueFilename } from '../../../utils';
import * as SUT from '../../playwright-fluent';
import path from 'path';

describe('Playwright Fluent - recordNetworkActivity()', (): void => {
  let p: SUT.PlaywrightFluent;
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should return an error when no path has been set', async (): Promise<void> => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await p.recordNetworkActivity({ path: '' });
      p.getRecordedNetworkActivity();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      "HAR filepath has not been setup. Ensure you have called 'recordNetworkActivity({path: <valid file path>})'.",
    );
  });
  test('should return an error when browser has not been closed', async (): Promise<void> => {
    // Given
    const harFilepath = `${path.join(
      __dirname,
      uniqueFilename({ prefix: 'har-', extension: '.json' }),
    )}`;

    // When
    let result: Error | undefined = undefined;
    try {
      await p.recordNetworkActivity({ path: harFilepath });
      p.getRecordedNetworkActivity();
    } catch (error) {
      result = error as Error;
    }

    // Then
    expect(result && result.message).toContain(
      `File '${harFilepath}' does not exist. Ensure you have called 'recordNetworkActivity({path: ${harFilepath}})' and that you have closed the browser. HAR data is only saved to disk when the browser is closed.`,
    );
  });
});
