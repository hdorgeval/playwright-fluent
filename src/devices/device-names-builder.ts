import { writeFileSync } from 'fs';
import * as path from 'path';
import { allKnownDevices } from './device-descriptors';

const deviceNames =
  'export type DeviceName = ' +
  allKnownDevices
    .map((d) => d.name)
    .map((name) => `'${name}'`)
    .join('|');

writeFileSync(path.join(__dirname, 'device-names.ts'), deviceNames);
