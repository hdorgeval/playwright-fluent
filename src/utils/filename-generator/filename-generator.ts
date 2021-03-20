import { v4 } from 'uuid';

export function uniqueFilename(
  options: Partial<{ prefix: string; extension: string }> = { prefix: '', extension: '.json' },
): string {
  return `${options.prefix || ''}${v4()}${options.extension || '.json'}`;
}
