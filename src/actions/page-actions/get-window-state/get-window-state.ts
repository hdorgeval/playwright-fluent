import { Page } from 'playwright';

declare const window: Window;

export interface WindowState {
  /**
   * Interior height of the browser window in pixels,
   * including the height of the horizontal scroll bar, if present.
   *
   * @type {number}
   * @memberof WindowState
   */
  innerHeight: number;

  /**
   * Interior width of the browser window in pixels.
   * This includes the width of the vertical scroll bar,
   * if one is present.
   *
   * @type {number}
   * @memberof WindowState
   */
  innerWidth: number;
  /**
   * Tells if the browser window is very near to the screen size
   *
   * @type {boolean}
   * @memberof WindowState
   */
  isMaximized: boolean;

  /**
   * Width of the whole browser window,
   * including sidebar (if expanded),
   * window chrome and window resizing borders/handles
   *
   * @type {number}
   * @memberof WindowState
   */
  outerHeight: number;

  /**
   *
   *
   * @type {number}
   * @memberof WindowState
   */
  outerWidth: number;
  screen: {
    availWidth: number;
    availHeight: number;
  };
}
export async function getWindowState(page: Page | undefined): Promise<WindowState> {
  if (page) {
    const windowStateSerialized = await page.evaluate((): string => {
      const result = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        screen: {
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
        },
        isMaximized:
          Math.abs(window.outerWidth - window.screen.availWidth) <
            window.screen.availWidth * 0.03 &&
          Math.abs(window.outerHeight - window.screen.availHeight) < 100,
      };
      return JSON.stringify(result);
    });
    const windowState = JSON.parse(windowStateSerialized);
    return windowState;
  }
  throw new Error('Cannot get window state because no browser has been launched');
}
