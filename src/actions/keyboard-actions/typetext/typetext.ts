import { ClickOptions } from '../../../controller';
import { defaultWaitUntilOptions } from '../../../utils';
import { Page } from 'playwright';
declare const window: Window;

export interface TypeTextOptions {
  delay: number;
}

export const defaultTypeTextOptions: TypeTextOptions = {
  delay: 50,
};
export async function typeText(
  text: string,
  page: Page | undefined,
  options: TypeTextOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot type text '${text}' because no browser has been launched`);
  }
  const focusedElement = await page.evaluateHandle(() => window.document.activeElement);

  if (focusedElement === null) {
    throw new Error(`You must first click on an editable element before typing text.`);
  }

  const handle = focusedElement.asElement();
  if (handle === null) {
    throw new Error(`You must first click on an editable element before typing text.`);
  }

  const currentTagName = await handle.evaluate((node) => (node as HTMLElement).tagName);
  const isContentEditable = await handle.evaluate(
    (node) => (node as HTMLElement).isContentEditable,
  );

  if (currentTagName === 'BODY') {
    throw new Error(`You must first click on an editable element before typing text.`);
  }

  if (currentTagName === 'P' && !isContentEditable) {
    throw new Error(`You must first click on an editable element before typing text.`);
  }

  const tripleClickOptions: ClickOptions = {
    ...defaultWaitUntilOptions,
    button: 'left',
    delay: options.delay,
    clickCount: 3,
  };

  await handle.click(tripleClickOptions);
  await page.waitFor(500);
  await page.keyboard.press('Backspace', { delay: options.delay });
  await page.keyboard.type(text, options);
}
