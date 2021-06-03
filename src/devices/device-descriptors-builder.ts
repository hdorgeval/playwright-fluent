import { Device } from './device-descriptors';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

const deviceDescriptorsFileName = path.join(__dirname, 'deviceDescriptorsSource.json');

interface DeviceDescriptorsSource {
  [key: string]: Device;
}

const devicesDescriptors = JSON.parse(
  readFileSync(deviceDescriptorsFileName).toString(),
) as DeviceDescriptorsSource;

const allKnownDevices: Device[] = [];

for (const key in devicesDescriptors) {
  const deviceDescriptor = devicesDescriptors[key];
  const knownDevice: Device = {
    ...deviceDescriptor,
    name: key,
  };
  allKnownDevices.push(knownDevice);
}

writeFileSync(
  path.join(__dirname, 'device-descriptors.json'),
  JSON.stringify(allKnownDevices, null, 2),
);
