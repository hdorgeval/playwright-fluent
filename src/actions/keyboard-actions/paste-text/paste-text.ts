import { defaultWaitUntilOptions, sleep, toPage } from '../../../utils';
import { ClickOptions } from '../../handle-actions';
import { Frame, Page } from 'playwright';
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
  /**
   * Should be set to true when the underlying selector does not explicitely handle the paste event.
   * When sets to true, playwright-fluent automatically attaches a paste event handler on the focused selector.
   * Defaults to false.
   *
   * @type {boolean}
   * @memberof PasteTextOptions
   */
  handlePasteEvent: boolean;
}

export const defaultPasteTextOptions: PasteTextOptions = {
  delay: 50,
  handlePasteEvent: false,
};

export async function pasteText(
  text: string,
  page: Page | Frame | undefined,
  options: PasteTextOptions,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot paste text '${text}' because no browser has been launched`);
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

  if (currentTagName === 'DIV' && !isContentEditable) {
    throw new Error(`You must first click on an editable element before clearing text.`);
  }

  const tripleClickOptions: ClickOptions = {
    ...defaultWaitUntilOptions,
    button: 'left',
    delay: options.delay,
    clickCount: 3,
  };

  await handle.click(tripleClickOptions);
  await sleep(options.delay * 5);
  await toPage(page).keyboard.press('Backspace', { delay: options.delay });

  await handle.evaluate(
    (node: Node, { content, handlePasteEvent }) => {
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
      const event = new CustomEvent('paste', {
        bubbles: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event as any).clipboardData = { getData: (): string => content };
      node.dispatchEvent(event);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).clipboardData = undefined;
    },
    { content: text, handlePasteEvent: options.handlePasteEvent },
  );
}
