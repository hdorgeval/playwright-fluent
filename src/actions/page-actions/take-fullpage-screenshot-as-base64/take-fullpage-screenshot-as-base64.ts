import { Page } from 'playwright';

export interface ScreenshotOptions {
  fullPage: boolean;
  /**
   * Hides default white background and allows capturing screenshots with transparency.
   * Not applicable to jpeg images.
   * Defaults to false.
   *
   * @type {boolean}
   * @memberof ScreenshotOptions
   */
  omitBackground: boolean;
}

const mandatoryFullPageScreenshotOptions: Partial<ScreenshotOptions> = {
  fullPage: true,
};

export const defaultFullPageScreenshotOptions: ScreenshotOptions = {
  fullPage: true,
  omitBackground: false,
};

export async function takeFullPageScreenshotAsBase64(
  page: Page | undefined,
  options: ScreenshotOptions,
): Promise<string> {
  if (!page) {
    throw new Error(
      `Cannot take a screenshot of the full page because no browser has been launched`,
    );
  }

  const screenshotOptions: ScreenshotOptions = {
    ...options,
    ...mandatoryFullPageScreenshotOptions,
  };

  const screenshot = await page.screenshot(screenshotOptions);
  const result = screenshot.toString('base64');
  return result;
}
