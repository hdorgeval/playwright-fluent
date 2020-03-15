import { defaultWaitUntilOptions } from '../../../utils';
import { ClickOptions } from '../../handle-actions';
import { Page } from 'playwright';
declare const window: Window;

export interface PasteTextOptions {
  /**
   * Time to wait between key presses in milliseconds.
   * Defaults to 50
   *
   * @type {number}
   * @memberof TypeTextOptions
   */
  delay: number;
  handlePasteEvent: boolean;
}

export const defaultPasteTextOptions: PasteTextOptions = {
  delay: 50,
  handlePasteEvent: false,
};

export async function pasteText(
  text: string,
  page: Page | undefined,
  options: PasteTextOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot paste text because no browser has been launched`);
  }
  const focusedElement = await page.evaluateHandle(() => window.document.activeElement);

  if (focusedElement === null) {
    throw new Error(`You must first click on an editable element before pasting text.`);
  }

  const handle = focusedElement.asElement();
  if (handle === null) {
    throw new Error(`You must first click on an editable element before pasting text.`);
  }

  const currentTagName = await handle.evaluate((node) => (node as HTMLElement).tagName);
  const isContentEditable = await handle.evaluate(
    (node) => (node as HTMLElement).isContentEditable,
  );

  if (currentTagName === 'BODY') {
    throw new Error(`You must first click on an editable element before pasting text.`);
  }

  if (currentTagName === 'P' && !isContentEditable) {
    throw new Error(`You must first click on an editable element before pasting text.`);
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

  await handle.evaluate(
    (node, content: string, handlePasteEvent: boolean) => {
      function attachPasteEvent(el: Node): void {
        el.addEventListener('paste', (event: Event | InputEvent | ClipboardEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const content = ((event as any).clipboardData || (window as any).clipboardData).getData(
            'text',
          ) as string;
          const input = event.target as HTMLInputElement;
          if (event.target && input && input.tagName === 'INPUT') {
            input.value = content;
            event.preventDefault();
            return;
          }
          (event.target as HTMLElement).innerText = content;
          event.preventDefault();
        });
      }

      if (handlePasteEvent) {
        attachPasteEvent(node);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = { getData: (): string => content };
      // eslint-disable-next-line no-undef
      const event = new CustomEvent('paste', {
        bubbles: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).clipboardData = { getData: (): string => content };
      node.dispatchEvent(event);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = undefined;
    },
    text,
    options.handlePasteEvent,
  );
}
