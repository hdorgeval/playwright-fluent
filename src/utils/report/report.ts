export function report(message: string, verbose: boolean): void {
  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
