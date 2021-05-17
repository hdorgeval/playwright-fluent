import { getHarDataFrom, HarEntry } from '.';
import { writeFileSync } from 'fs';

export interface shrinkHarFileOptions {
  inputFile: string;
  outputFile: string;

  entryFilter: (entry: HarEntry) => boolean;
}
export function reduceHarFile(options: shrinkHarFileOptions): void {
  const data = getHarDataFrom(options.inputFile);
  const entries = data.log.entries;
  data.log.entries = entries.filter(options.entryFilter);
  writeFileSync(options.outputFile, JSON.stringify(data, null, 2));
}
