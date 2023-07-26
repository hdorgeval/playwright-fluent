import { Page } from 'playwright';
import * as SUT from '../index';

describe('record downloads to', (): void => {
  beforeEach((): void => {});

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;
    const downloadsDirectory = __dirname;

    // When
    // Then
    const expectedError = new Error(
      `Cannot record downloads to '${downloadsDirectory}' because no browser has been launched`,
    );
    await SUT.recordDownloadsTo(downloadsDirectory, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
