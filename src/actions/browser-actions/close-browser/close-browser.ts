import { sleep } from '../../../utils';
import { Browser } from 'playwright';

export interface CloseOptions {
  /**
   * Time out used to prevent too slow or buggy browser closing.
   * Defaults to 3000 milliseconds.
   *
   * @type {number}
   * @memberof CloseOptions
   */
  timeoutInMilliseconds: number;
}

export const defaultCloseOptions: CloseOptions = {
  timeoutInMilliseconds: 3000,
};

export async function closeBrowser(
  browser: Browser | undefined,
  options: CloseOptions,
): Promise<void> {
  if (browser === undefined) {
    return;
  }

  const contexts = browser.contexts();
  if (Array.isArray(contexts) && contexts.length > 0) {
    for (let index = 0; index < contexts.length; index++) {
      const context = contexts[index];
      try {
        await Promise.race([context.close(), sleep(options.timeoutInMilliseconds)]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error while closing the browser context', error);
      }
    }
  }

  try {
    await Promise.race([browser.close(), sleep(options.timeoutInMilliseconds)]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error while closing the browser', error);
  }
}
