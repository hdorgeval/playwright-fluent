import { DeviceName } from './device-names';
import { allKnownDevices, Device } from './device-descriptors';
import { BrowserName } from '../actions';

export function getDevice(deviceName: DeviceName): Device | undefined {
  const device = allKnownDevices.filter((d) => d.name === deviceName).shift();
  return device;
}

export const defaultDevice: Device = {
  name: 'iPhone X landscape',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  viewport: {
    width: 812,
    height: 375,
    deviceScaleFactor: 3,
    isMobile: true,
  },
};

export function getBrowserArgsForDevice(
  device: Device,
): { andBrowser: (browsername: BrowserName) => string[] } {
  return {
    andBrowser: (browsername: BrowserName): string[] => {
      switch (browsername) {
        case 'chromium':
        case 'chrome-canary':
        case 'chrome': {
          const arg = `--window-size=${device.viewport.width},${device.viewport.height + 100}`;
          return [arg];
        }

        case 'firefox': {
          const arg1 = `-height=${device.viewport.height + 52}`;
          const arg2 = `-width=${device.viewport.width}`;
          return [arg1, arg2];
        }

        default:
          return [];
      }
    },
  };
}
