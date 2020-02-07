import { Page } from 'playwright';
export interface NavigationOptions {
  timeout: number;
}
export const defaultNavigationOptions: NavigationOptions = {
  timeout: 30000,
};
export async function navigateTo(
  url: string,
  options: NavigationOptions,
  page: Page | undefined,
): Promise<void> {
  if (page) {
    await page.goto(url, options);
    return;
  }
  throw new Error(`Cannot navigate to '${url}' because no browser has been launched`);
}
