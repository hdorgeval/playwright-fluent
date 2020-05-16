import { BrowserName } from '..';
const isCI = require('is-ci') as boolean;

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowSizeOptions {
  ciOnly: boolean;
}

export const defaultWindowSizeOptions: WindowSizeOptions = {
  ciOnly: false,
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getBrowserArgsForWindowSize(size: WindowSize, options: WindowSizeOptions) {
  return {
    andBrowser: (browsername: BrowserName): string[] => {
      if (!size) {
        return [];
      }

      if (options && options.ciOnly && isCI === false) {
        return [];
      }

      switch (browsername) {
        case 'chromium':
        case 'chrome-canary':
        case 'chrome': {
          const arg = `--window-size=${size.width},${size.height}`;
          return [arg];
        }

        case 'firefox': {
          const arg1 = `-height=${size.height}`;
          const arg2 = `-width=${size.width}`;
          return [arg1, arg2];
        }

        default:
          return [];
      }
    },
  };
}

export const _800x600: WindowSize = {
  width: 800,
  height: 600,
};

export const _1024x768: WindowSize = {
  width: 1024,
  height: 768,
};

export const _1280x720: WindowSize = {
  width: 1280,
  height: 720,
};

export const _1600x900: WindowSize = {
  width: 1600,
  height: 900,
};

export const windowsize = {
  _800x600,
  _1024x768,
  _1280x720,
  _1600x900,
};
