import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import {
  waitUntil,
  WaitUntilOptions,
  defaultWaitUntilOptions,
  safeToString,
  report,
} from '../../utils';

export async function expectThatAsyncFuncHasResult(
  func: () => Promise<string | number | boolean | null | undefined>,
  expectedResult: string | number | boolean | null | undefined,
  options: Partial<AssertOptions> = defaultAssertOptions,
): Promise<void> {
  const assertOptions: AssertOptions = {
    ...defaultAssertOptions,
    ...options,
  };

  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...assertOptions,
    throwOnTimeout: true,
  };

  report(
    `Checking that async function resolves to '${safeToString(expectedResult)}' ...`,
    waitOptions.verbose,
  );

  await waitUntil(
    async () => {
      const result = await func();
      report(`Async function returned '${safeToString(result)}'`, waitOptions.verbose);
      return result === expectedResult;
    },
    async (): Promise<string> => {
      const currentValue = await func();
      return `Async function did not have expected result '${safeToString(
        expectedResult,
      )}', but instead it resolved to '${safeToString(currentValue)}'`;
    },
    waitOptions,
  );
}
