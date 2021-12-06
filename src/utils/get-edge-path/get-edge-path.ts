import * as which from 'which';
import * as os from 'os';

const currentPlatformType = os.type();

export function getEdgePath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';

    case 'Windows_NT':
      return '%windir%/SystemApps/Microsoft.MicrosoftEdge_8wekyb3d8bbwe/MicrosoftEdge.exe';

    case 'Linux':
      if (which.sync('microsoft-edge', { nothrow: true })) {
        return which.sync('microsoft-edge');
      }
      throw new Error('Can not find installed "microsoft-edge"');

    default:
      throw new Error('You should supply the path to the Edge App in the launch options');
  }
}
