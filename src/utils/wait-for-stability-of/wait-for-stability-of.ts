import { report } from '../report';
import { sleep } from '../sleep';
import { defaultWaitUntilOptions, WaitUntilOptions } from '../wait-until';

function raw(input: string | boolean | number | null | undefined): string {
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
/**
 * Waits until the function getValue() returns the same result during 300 ms.
 * The waiting mechanism can be modified by setting options
 *
 * @export
 * @param {(() => Promise<string | boolean | number | null | undefined>)} getValue
 * @param {(string | (() => Promise<string>))} errorMessage
 * @param {WaitUntilOptions} [options=defaultWaitUntilOptions]
 * @returns {Promise<void>}
 */
export async function waitForStabilityOf(
  getValue: () => Promise<string | boolean | number | null | undefined>,
  errorMessage: string | (() => Promise<string>),
  options: Partial<WaitUntilOptions> = defaultWaitUntilOptions,
): Promise<void> {
  const waitOptions: WaitUntilOptions = {
    ...defaultWaitUntilOptions,
    ...options,
  };

  report('wait options:', waitOptions.verbose);
  report(JSON.stringify(waitOptions, null, 2), waitOptions.verbose);

  const timeout = waitOptions.timeoutInMilliseconds;
  const interval =
    waitOptions.stabilityInMilliseconds <= 0 ? 1 : waitOptions.stabilityInMilliseconds / 3;
  const nbIntervals = timeout <= 0 ? 1 : timeout / interval;
  const stabilityCounterMaxValue = waitOptions.stabilityInMilliseconds / interval;
  let stabilityCounterCurrentValue = 0;

  let previousResult = await getValue();
  report(`value function has initially returned '${raw(previousResult)}'`, waitOptions.verbose);

  for (let index = 0; index < nbIntervals; index++) {
    await sleep(interval);
    const result = await getValue();
    report(
      `value function returned '${raw(result)}' after waiting ${(index + 1) * interval} ms`,
      waitOptions.verbose,
    );

    if (result === previousResult) {
      stabilityCounterCurrentValue += 1;
    }
    if (result !== previousResult) {
      previousResult = result;
      stabilityCounterCurrentValue = 0;
    }

    if (stabilityCounterCurrentValue >= stabilityCounterMaxValue) {
      report(
        `value function always returned '${raw(result)}' during ${
          stabilityCounterCurrentValue > 0 ? stabilityCounterCurrentValue * interval : interval
        } ms: no need to wait anymore.`,
        waitOptions.verbose,
      );
      return;
    }
  }

  report(
    `value function could not converge to a stable result during ${waitOptions.timeoutInMilliseconds} ms.`,
    waitOptions.verbose,
  );

  report(`timeout of ${waitOptions.timeoutInMilliseconds} ms as been reached`, waitOptions.verbose);

  if (!options.throwOnTimeout) {
    report('exiting waiting mechanism without throwing', waitOptions.verbose);
    return;
  }

  report('exiting waiting mechanism with throwing', waitOptions.verbose);
  if (typeof errorMessage === 'string') {
    throw new Error(errorMessage);
  }

  throw new Error(await errorMessage());
}
