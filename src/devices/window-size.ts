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

export function getBrowserArgsForWindowSize(
  size: WindowSize,
  options: WindowSizeOptions,
): { andBrowser: (browsername: BrowserName) => string[] } {
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

export const _1600x1024: WindowSize = {
  width: 1600,
  height: 1024,
};

export const _1600x1200: WindowSize = {
  width: 1600,
  height: 1200,
};

export const _1920x1080: WindowSize = {
  width: 1920,
  height: 1080,
};

export const _1920x1200: WindowSize = {
  width: 1920,
  height: 1200,
};

export const _1920x1440: WindowSize = {
  width: 1920,
  height: 1440,
};

export const _2560x1440: WindowSize = {
  width: 2560,
  height: 1440,
};

export const _3840x2160: WindowSize = {
  width: 3840,
  height: 2160,
};

export const sizeOf = {
  _800x600,
  _1024x768,
  _1280x720,
  _1600x1024,
  _1600x1200,
  _1600x900,
  _1920x1080,
  _1920x1200,
  _1920x1440,
  _2560x1440,
  _3840x2160,
};
