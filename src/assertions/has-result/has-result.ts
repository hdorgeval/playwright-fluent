import { AssertOptions, defaultAssertOptions } from '../../fluent-api';
import { waitUntil, WaitUntilOptions, defaultWaitUntilOptions, safeToString } from '../../utils';

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

  await waitUntil(
    async () => (await func()) === expectedResult,
    async (): Promise<string> => {
      const currentValue = await func();
      return `'${func.name}' did not have expected result '${safeToString(
        expectedResult,
      )}', but instead it resolved to '${safeToString(currentValue)}'`;
    },
    waitOptions,
  );
}
