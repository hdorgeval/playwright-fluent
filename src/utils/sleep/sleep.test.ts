import * as SUT from './index';

describe('sleep N milliseconds', (): void => {
  test('should wait', async (): Promise<void> => {
    // Given
    const wait = 3000;

    // When
    const startTime = new Date().getTime();
    await SUT.sleep(wait);
    const endTime = new Date().getTime();

    // Then
    const duration = endTime - startTime;
    const actualDiff = duration - wait;
    // eslint-disable-next-line no-console
    console.log(`measured duration - sleep duration = ${actualDiff} ms`);
    expect(Math.abs(actualDiff)).toBeLessThan(500); // the difference might be unexpectedly huge on CI
  });
});
