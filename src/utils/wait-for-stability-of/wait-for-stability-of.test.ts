import * as SUT from './index';
import { WaitUntilOptions, defaultWaitUntilOptions, noWaitNoThrowOptions } from '../wait-until';

describe('wait for stability of', (): void => {
  test('should wait until value function returns bar', async (): Promise<void> => {
    // Given
    const wait = 500;
    const startTime = new Date().getTime();
    const valueFunction = async (): Promise<string> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return 'foo';
      }
      return 'bar';
    };

    // When
    await SUT.waitForStabilityOf(valueFunction, 'cannot wait any more!', {
      stabilityInMilliseconds: 1000,
    });
    const result = await valueFunction();

    // Then
    expect(result).toBe('bar');
  });

  test('should wait until value function returns a null', async (): Promise<void> => {
    // Given
    const wait = 500;
    const startTime = new Date().getTime();
    const valueFunction = async (): Promise<null | undefined> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return undefined;
      }
      return null;
    };

    // When
    await SUT.waitForStabilityOf(valueFunction, 'cannot wait any more!', {
      stabilityInMilliseconds: 1000,
      verbose: false,
    });
    const result = await valueFunction();

    // Then
    expect(result).toBeNull();
  });
  test('should wait until value function returns undefined', async (): Promise<void> => {
    // Given
    const wait = 500;
    const startTime = new Date().getTime();
    const valueFunction = async (): Promise<null | undefined> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return null;
      }
      return undefined;
    };

    // When
    await SUT.waitForStabilityOf(valueFunction, 'cannot wait any more!', {
      stabilityInMilliseconds: 1000,
    });
    const result = await valueFunction();

    // Then
    expect(result).toBeUndefined();
  });

  test('should wait until value function returns 0', async (): Promise<void> => {
    // Given
    const wait = 500;
    const startTime = new Date().getTime();
    const valueFunction = async (): Promise<number> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return -1;
      }
      return 0;
    };

    // When
    await SUT.waitForStabilityOf(valueFunction, 'cannot wait any more!', {
      stabilityInMilliseconds: 1000,
    });
    const result = await valueFunction();

    // Then
    expect(result).toBe(0);
  });

  test('should wait until value function returns false', async (): Promise<void> => {
    // Given
    const wait = 500;
    const startTime = new Date().getTime();
    const valueFunction = async (): Promise<boolean> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return true;
      }
      return false;
    };

    // When
    await SUT.waitForStabilityOf(valueFunction, 'cannot wait any more!', {
      stabilityInMilliseconds: 1000,
    });
    const result = await valueFunction();

    // Then
    expect(result).toBe(false);
  });

  test('should not throw on timeout', async (): Promise<void> => {
    // Given
    const wait = 1000;
    const startTime = new Date().getTime();
    const valueFunction = async (): Promise<number> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return -1;
      }
      return 0;
    };

    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      timeoutInMilliseconds: 200,
      throwOnTimeout: false,
      verbose: false,
    };

    // When
    await SUT.waitForStabilityOf(valueFunction, 'cannot wait any more!', options);
    const result = await valueFunction();

    // Then
    expect(result).toBe(-1);
  });

  test('should not wait and not throw', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      ...noWaitNoThrowOptions,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    const startTime = new Date().getTime();

    // When
    await SUT.waitForStabilityOf(predicate, 'cannot wait any more!', options);
    const result = await predicate();
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    // eslint-disable-next-line no-console
    console.log(`measured duration with noWaitNoThrowOptions = ${duration} ms`);
    expect(duration).toBeLessThan(3000);
    expect(result).toBe(false);
  });

  test('should throw when timeout is reached', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      stabilityInMilliseconds: 300,
      timeoutInMilliseconds: 200,
      verbose: false,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    // When
    // Then
    const expectedError = new Error('cannot wait any more!');
    await SUT.waitForStabilityOf(predicate, 'cannot wait any more!', options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw func when timeout is reached', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      stabilityInMilliseconds: 300,
      timeoutInMilliseconds: 200,
      verbose: false,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    // When
    // Then
    const expectedError = new Error('cannot wait any more!');
    await SUT.waitForStabilityOf(
      predicate,
      () => Promise.resolve('cannot wait any more!'),
      options,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });
});
