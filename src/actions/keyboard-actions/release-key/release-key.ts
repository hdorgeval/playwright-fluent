import { KeyboardHoldKey } from '../hold-down-key';
import { Page } from 'playwright';
export async function releaseKey(key: KeyboardHoldKey, page: Page | undefined): Promise<void> {
  if (!page) {
    throw new Error(`Cannot release key '${key}' because no browser has been launched`);
  }

  await page.keyboard.up(key);
}
