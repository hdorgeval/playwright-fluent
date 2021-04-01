import { Page } from 'playwright';
import path from 'path';
export async function recordDownloadsTo(
  downloadDirectory: string,
  page: Page | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot record downloads to '${downloadDirectory}' because no browser has been launched`,
    );
  }

  page.on('download', async (download) => {
    const filename = download.suggestedFilename();
    const filepath = path.join(downloadDirectory, filename);
    download.saveAs(filepath);
    await download.path();
  });
}
