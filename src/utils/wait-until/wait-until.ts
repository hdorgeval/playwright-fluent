import { report } from '../report';
import { sleep } from '../sleep';

export interface WaitUntilOptions {
  /**
   * Defaults to 30000 milliseconds.
   *
   * @type {number}
   * @memberof WaitUntilOptions
   */
  timeoutInMilliseconds: number;
  /**
   * Time during which the callback must always return true.
   * Defaults to 300 milliseconds.
   * You must not setup a duration < 100 milliseconds.
   * @type {number}
   * @memberof AssertOptions
   */
  stabilityInMilliseconds: number;
  /**
   * Throw a timeout exception when the callback still returns false.
   * Defaults to false.
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  throwOnTimeout: boolean;
  /**
   * Output to the console all steps of the waiting mechanism.
   * Defaults to false.
   * Use this option when the waitUntil() method does not wait as expected.
   *
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  verbose: boolean;
}

export const defaultWaitUntilOptions: WaitUntilOptions = {
  stabilityInMilliseconds: 300,
  throwOnTimeout: false,
  timeoutInMilliseconds: 30000,
  verbose: false,
};

/**
 * Wait until predicate becomes true,
 * and always return true during 300 ms.
 * The waiting mechanism can be modified by setting options
 *
 * @export
 * @param {() => Promise<boolean>} predicate
 * @param {(string | (() => Promise<string>))} errorMessage
 * @param {WaitUntilOptions} [options=defaultWaitUntilOptions]
 * @returns {Promise<void>}
 */
export async function waitUntil(
  predicate: () => Promise<boolean>,
  errorMessage: string | (() => Promise<string>),
  options: WaitUntilOptions = defaultWaitUntilOptions,
): Promise<void> {
  report('wait options:', options.verbose);
  report(JSON.stringify(options, null, 2), options.verbose);

  const timeout = options.timeoutInMilliseconds;
  const interval = options.stabilityInMilliseconds / 3;
  const nbIntervals = timeout / interval;
  const stabilityCounterMaxValue = options.stabilityInMilliseconds / interval;
  let stabilityCounterCurrentValue = 0;

  for (let index = 0; index < nbIntervals; index++) {
    await sleep(interval);
    const result = await predicate();
    report(
      `predicate returned ${result} after waiting ${(index + 1) * interval} ms`,
      options.verbose,
    );

    if (result === true) {
      stabilityCounterCurrentValue += 1;
    }
    if (result === false) {
      stabilityCounterCurrentValue = 0;
    }

    if (stabilityCounterCurrentValue >= stabilityCounterMaxValue) {
      report(
        `predicate always returned ${result} during ${options.stabilityInMilliseconds} ms: no need to wait anymore.`,
        options.verbose,
      );
      return;
    }
  }

  report(
    `predicate could not converge to a stable result or always returned false during ${options.timeoutInMilliseconds} ms.`,
    options.verbose,
  );

  if (!options.throwOnTimeout) {
    report('exiting waiting mechanism without throwing', options.verbose);
    return;
  }

  if (typeof errorMessage === 'string') {
    throw new Error(errorMessage);
  }

  throw new Error(await errorMessage());
}
