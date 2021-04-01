import * as SUT from '../index';
import { Page } from 'playwright';

describe('record downloads to', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

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
