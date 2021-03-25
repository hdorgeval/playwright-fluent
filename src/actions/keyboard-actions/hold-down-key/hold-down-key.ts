import { toPage } from '../../../utils';
import { Frame, Page } from 'playwright';

export type KeyboardHoldKey = 'Shift' | 'Control' | 'Alt' | 'Meta';

export async function holdDownKey(
  key: KeyboardHoldKey,
  page: Page | Frame | undefined,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot hold down key '${key}' because no browser has been launched`);
  }

  await toPage(page).keyboard.down(key);
}
