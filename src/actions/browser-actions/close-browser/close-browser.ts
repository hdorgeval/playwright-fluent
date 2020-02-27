import { Browser } from 'playwright';

export async function closeBrowser(browser: Browser | undefined): Promise<void> {
  if (browser === undefined) {
    return;
  }

  const contexts = browser.contexts();
  if (Array.isArray(contexts) && contexts.length > 0) {
    contexts.forEach((context) => {
      try {
        context.close();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error while closing the browser context', error);
      }
    });
  }

  try {
    await browser.close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error while closing the browser', error);
  }
}
