import { Frame, Page } from 'playwright';
import { KeyboardHoldKey } from '../hold-down-key';
import { toPage } from '../../../utils';
export async function releaseKey(
  key: KeyboardHoldKey,
  page: Page | Frame | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot release key '${key}' because no browser has been launched`);
  }

  await toPage(page).keyboard.up(key);
}
