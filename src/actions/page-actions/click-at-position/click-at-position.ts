import { Page } from 'playwright';
import { ClickOptions, Point } from '../../handle-actions';

export async function clickAtPosition(
  position: Point,
  page: Page | undefined,
  options: ClickOptions,
): Promise<void> {
  if (!page) {
    throw new Error(
      `Cannot click at position 'x: ${position.x}, y: ${position.y}' because no browser has been launched`,
    );
  }

  await page.mouse.move(position.x, position.y, { steps: 10 });
  await page.mouse.click(position.x, position.y, options);
}
