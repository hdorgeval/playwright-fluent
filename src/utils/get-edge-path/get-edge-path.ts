import * as os from 'os';

const currentPlatformType = os.type();

export function getEdgePath(): string {
  switch (currentPlatformType) {
    case 'Darwin':
      return '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';

    case 'Windows_NT':
      return '%windir%/SystemApps/Microsoft.MicrosoftEdge_8wekyb3d8bbwe/MicrosoftEdge.exe';

    case 'Linux':
      // Need help to get default install path on Linux. PR is welcomed
      throw new Error('You should supply the path to the Edge App in the launch options');

    default:
      throw new Error('You should supply the path to the Edge App in the launch options');
  }
}
