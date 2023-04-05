import { EOL } from 'os';
import { Page } from 'playwright';

export async function recordPageErrors(
  page: Page | undefined,
  callback: (error: Error) => void,
): Promise<void> {
  if (!page) {
    throw new Error(`Cannot record page errors because no browser has been launched`);
  }

  page.on('pageerror', (err) => {
    callback(err);
  });

  page.on('console', async (msg) => {
    try {
      if (msg.type() === 'error') {
        const location = msg.location();
        const text = msg
          .text()
          .replace(/JSHandle@object/g, '')
          .trim();
        const args = msg.args();
        const stackTrace: string[] = [];
        stackTrace.push(`at '${location.url}'`);
        stackTrace.push(`line: ${location.lineNumber}`);
        for (let index = 1; index < args.length; index++) {
          try {
            const arg = args[index];
            const argValue = JSON.stringify(await arg.jsonValue(), null, 2);
            stackTrace.push(argValue);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Cannot evaluate the object passed to the console : ', error);
          }
        }

        const err = new Error(text);
        err.stack = stackTrace.join(EOL);
        callback(err);
      }
    } catch (error) {
      callback(error as Error);
    }
  });
}
