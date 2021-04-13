import { report } from '../report';
import { sleep } from '../sleep';

export interface WaitOptions {
  /**
   * Defaults to 30000 milliseconds.
   *
   * @type {number}
   * @memberof WaitOptions
   */
  timeoutInMilliseconds: number;
  /**
   * Time during which the callback must always return true.
   * Defaults to 300 milliseconds.
   * You must not setup a duration < 100 milliseconds.
   * @type {number}
   * @memberof WaitOptions
   */
  stabilityInMilliseconds: number;
}

export interface WaitUntilOptions extends WaitOptions {
  /**
   * Throw a timeout exception when the callback still returns false.
   * Defaults to true.
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

  /**
   * Prevents the predicate execution to break the wait-until loop.
   * Defaults to false.
   * Use this option when the predicate execution might throw an exception (in case for example of a page reload, or when navigating to another page)
   * @type {boolean}
   * @memberof WaitUntilOptions
   */
  wrapPredicateExecutionInsideTryCatch: boolean;
}

export const defaultWaitUntilOptions: WaitUntilOptions = {
  stabilityInMilliseconds: 300,
  throwOnTimeout: true,
  timeoutInMilliseconds: 30000,
  verbose: false,
  wrapPredicateExecutionInsideTryCatch: false,
};

export const noWaitNoThrowOptions: WaitUntilOptions = {
  stabilityInMilliseconds: 0,
  throwOnTimeout: false,
  timeoutInMilliseconds: 0,
  verbose: false,
  wrapPredicateExecutionInsideTryCatch: true,
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
  const interval = options.stabilityInMilliseconds <= 3 ? 1 : options.stabilityInMilliseconds / 3;
  const nbIntervals = timeout <= 0 ? 1 : timeout / interval;
  const stabilityCounterMaxValue = options.stabilityInMilliseconds / interval;
  let stabilityCounterCurrentValue = 0;

  for (let index = 0; index < nbIntervals; index++) {
    await sleep(interval);
    const result = await safeExecutePredicate(
      predicate,
      options.wrapPredicateExecutionInsideTryCatch,
    );

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

    if (result && stabilityCounterCurrentValue >= stabilityCounterMaxValue) {
      report(
        `predicate always returned ${result} during ${
          stabilityCounterCurrentValue > 0 ? stabilityCounterCurrentValue * interval : interval
        } ms: no need to wait anymore.`,
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

async function safeExecutePredicate(
  predicate: () => Promise<boolean>,
  noThrow: boolean,
): Promise<boolean> {
  try {
    return await predicate();
  } catch (error) {
    if (noThrow) {
      return false;
    }
    throw error;
  }
}
