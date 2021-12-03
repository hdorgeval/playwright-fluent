import * as which from 'which';
import * as os from 'os';
import { existsSync } from 'fs';

const currentPlatformType = os.type();
const x86Path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const x64Path = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

export function getChromePath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

    case 'Windows_NT':
      if (existsSync(x64Path)) {
        return x64Path;
      }
      return x86Path;

    case 'Linux':
      if (which.sync('google-chrome-stable', { nothrow: true })) {
        return which.sync('google-chrome-stable');
      }
      if (which.sync('google-chrome', { nothrow: true })) {
        return which.sync('google-chrome');
      }

      throw new Error('You should supply the path to the Chrome App in the launch options');

    default:
      throw new Error('You should supply the path to the Chrome App in the launch options');
  }
}

export function getChromeCanaryPath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';

    case 'Windows_NT':
      return 'C:/Program Files (x86)/Google/Chrome SxS/Application/chrome.exe';

    case 'Linux':
      return 'google-chrome-unstable';

    default:
      throw new Error('You should supply the path to the Chrome Canary App in the launch options');
  }
}
