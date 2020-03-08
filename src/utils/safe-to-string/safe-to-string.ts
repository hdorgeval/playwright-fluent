export function safeToString(input: string | boolean | number | null | undefined): string {
  if (input === null) {
    return 'null';
  }

  if (input === undefined) {
    return 'undefined';
  }

  if (typeof input === 'boolean') {
    return `${input}`;
  }

  if (typeof input === 'number') {
    return `${input}`;
  }

  return input;
}
