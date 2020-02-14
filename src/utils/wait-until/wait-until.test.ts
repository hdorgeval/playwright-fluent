import * as SUT from './index';
import { WaitUntilOptions, defaultWaitUntilOptions } from './wait-until';

describe('wait until', (): void => {
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
      verbose: true,
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

  test('should throw when timeout is reached', async (): Promise<void> => {
    // Given
    const options: WaitUntilOptions = {
      stabilityInMilliseconds: 300,
      throwOnTimeout: true,
      timeoutInMilliseconds: 2000,
      verbose: true,
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

  test('should throw when timeout is reached - error message is a func', async (): Promise<
    void
  > => {
    // Given
    const options: WaitUntilOptions = {
      ...defaultWaitUntilOptions,
      stabilityInMilliseconds: 300,
      throwOnTimeout: true,
      timeoutInMilliseconds: 2000,
      verbose: true,
    };
    const predicate = async (): Promise<boolean> => {
      return false;
    };

    // When
    // Then
    const expectedError = new Error('cannot wait any more!');
    await SUT.waitUntil(
      predicate,
      () => Promise.resolve('cannot wait any more!'),
      options,
    ).catch((error): void => expect(error).toMatchObject(expectedError));
  });
});
