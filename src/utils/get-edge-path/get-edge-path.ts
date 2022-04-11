import * as os from 'os';
import * as which from 'which';

const currentPlatformType = os.type();

export function getEdgePath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';

    case 'Windows_NT':
      return 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

    case 'Linux':
      if (which.sync('microsoft-edge', { nothrow: true })) {
        return which.sync('microsoft-edge');
      }
      throw new Error(
        'Cannot find install path for Microsoft Edge. Either you can install it by running the command' +
          " 'npx playwright install msedge', or you should provide the path to the Edge App in the launch options.",
      );

    default:
      throw new Error('You should supply the path to the Edge App in the launch options');
  }
}
