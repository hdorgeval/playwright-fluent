import * as which from 'which';
import * as os from 'os';

const currentPlatformType = os.type();

export function getChromePath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

    case 'Windows_NT':
      return 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';

    case 'Linux':
      if (which.sync('google-chrome-stable')) {
        return 'google-chrome-stable';
      }
      return 'google-chrome';

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
