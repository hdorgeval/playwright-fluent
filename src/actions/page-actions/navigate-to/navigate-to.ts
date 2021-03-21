import { Frame, Page } from 'playwright';
export interface NavigationOptions {
  /**
   * Maximum navigation time in milliseconds,
   * defaults to 30 seconds,
   * pass 0 to disable timeout
   *
   * @type {number}
   * @memberof NavigationOptions
   */
  timeout: number;
}
export const defaultNavigationOptions: NavigationOptions = {
  timeout: 30000,
};
export async function navigateTo(
  url: string,
  options: NavigationOptions,
  page: Page | Frame | undefined,
): Promise<void> {
  if (page) {
    await page.goto(url, options);
    return;
  }
  throw new Error(`Cannot navigate to '${url}' because no browser has been launched`);
}
