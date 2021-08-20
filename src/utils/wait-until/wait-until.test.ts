import * as SUT from './index';
import { WaitUntilOptions, defaultWaitUntilOptions, noWaitNoThrowOptions } from './wait-until';

describe('wait until', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  test('should wait', async (): Promise<void> => {
    // Given
    const wait = 3000;
    const startTime = new Date().getTime();
    const predicate = async (): Promise<boolean> => {
      const endTime = new Date().getTime();
      if (endTime - startTime <= wait) {
        return false;
      }
      return true;
    };

    // When
    await SUT.waitUntil(predicate, 'cannot wait any more!');
    const result = await predicate();

    // Then
    expect(result).toBe(true);
  });

  test('should wait until timeout is reached then should not throw', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      stabilityInMilliseconds: 300,
      throwOnTimeout: false,
      timeoutInMilliseconds: 3000,
      verbose: false,
      wrapPredicateExecutionInsideTryCatch: false,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    // When
    await SUT.waitUntil(predicate, 'cannot wait any more!', options);
    const result = await predicate();

    // Then
    expect(result).toBe(false);
  });

  test('should wait until timeout is reached then should not throw even when predicate throws', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      stabilityInMilliseconds: 300,
      throwOnTimeout: false,
      timeoutInMilliseconds: 3000,
      verbose: false,
      wrapPredicateExecutionInsideTryCatch: true,
    };
    const predicate = async (): Promise<boolean> => {
      throw new Error('predicate error');
    };

    // When
    await SUT.waitUntil(predicate, 'cannot wait any more!', options);

    // Then
  });

  test('should not wait and not throw with predicate always false', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      ...noWaitNoThrowOptions,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    const startTime = new Date().getTime();

    // When
    await SUT.waitUntil(predicate, 'cannot wait any more!', options);
    const result = await predicate();
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    // eslint-disable-next-line no-console
    console.log(`measured duration with noWaitNoThrowOptions = ${duration} ms`);
    expect(duration).toBeLessThan(3000);
    expect(result).toBe(false);
  });

  test('should not wait and not throw with predicate always true', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      ...noWaitNoThrowOptions,
    };
    const predicate = async (): Promise<boolean> => {
      return true;
    };

    const startTime = new Date().getTime();

    // When
    await SUT.waitUntil(predicate, 'cannot wait any more!', options);
    const result = await predicate();
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    // eslint-disable-next-line no-console
    console.log(`measured duration with noWaitNoThrowOptions = ${duration} ms`);
    expect(duration).toBeLessThan(3000);
    expect(result).toBe(true);
  });

  test('should throw when timeout is reached', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      stabilityInMilliseconds: 300,
      throwOnTimeout: true,
      timeoutInMilliseconds: 2000,
      verbose: false,
      wrapPredicateExecutionInsideTryCatch: false,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    // When
    // Then
    const expectedError = new Error('cannot wait any more!');
    await SUT.waitUntil(predicate, 'cannot wait any more!', options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when timeout is reached - error message is a func', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      stabilityInMilliseconds: 300,
      throwOnTimeout: true,
      timeoutInMilliseconds: 2000,
      verbose: false,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    // When
    // Then
    const expectedError = new Error('cannot wait any more!');
    await SUT.waitUntil(predicate, () => Promise.resolve('cannot wait any more!'), options).catch(
      (error): void => expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when predicate throw', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      stabilityInMilliseconds: 300,
      throwOnTimeout: false,
      timeoutInMilliseconds: 2000,
      verbose: false,
      wrapPredicateExecutionInsideTryCatch: false,
    };
    const predicate = async (): Promise<boolean> => {
      throw new Error('predicate error');
    };

    // When
    // Then
    const expectedError = new Error('predicate error');
    await SUT.waitUntil(predicate, 'cannot wait any more!', options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
