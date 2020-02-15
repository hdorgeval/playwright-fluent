import { ElementHandle } from 'playwright';

export async function scrollToHandle(
  selector: ElementHandle<Element> | undefined | null,
): Promise<void> {
  if (!selector) {
    return;
  }

  await selector.evaluate((el: Element): void => {
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  });
}
