import * as SUT from '../../playwright-fluent';
import { deleteFile, ensureDirectoryExists, fileExists } from '../../../utils';
import * as path from 'path';

describe('Playwright Fluent - recordDownloadsTo(directory)', (): void => {
  let p: SUT.PlaywrightFluent;

  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should record successfull downloads', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-downloads-to.test.html')}`;
    const downloadsDirectory = path.join(__dirname, 'downloads');
    await ensureDirectoryExists(downloadsDirectory);

    const expectedDownloadedFilepath = path.join(downloadsDirectory, 'download.zip');
    deleteFile(expectedDownloadedFilepath);

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordDownloadsTo(downloadsDirectory)
      .navigateTo(url)
      .click('a#download-package')
      .waitUntil(async () => fileExists(expectedDownloadedFilepath));

    // Then
    expect(fileExists(expectedDownloadedFilepath)).toBe(true);
  });
});
