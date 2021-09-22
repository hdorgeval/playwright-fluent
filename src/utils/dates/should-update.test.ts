import * as SUT from './index';
import { UpdatePolicy } from '..';
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
describe('shouldUpdate', (): void => {
  let now: Date = new Date();
  beforeEach((): void => {
    now = new Date();
  });

  [
    { lastUpdate: () => now, policy: 'always' },
    {
      lastUpdate: () => addDays(now, -100),
      policy: '1/d',
    },
    {
      lastUpdate: () => addDays(now, -2),
      policy: '1/d',
    },
    {
      lastUpdate: () => addDays(now, -1),
      policy: '1/d',
    },
    {
      lastUpdate: () => addDays(now, -7),
      policy: '1/w',
    },
    {
      lastUpdate: () => addDays(now, -8),
      policy: '1/w',
    },
    {
      lastUpdate: () => addDays(now, -31),
      policy: '1/m',
    },
  ].forEach(({ lastUpdate, policy }: { lastUpdate: () => Date; policy: string }): void => {
    test(`should update when lastUpdate is ${lastUpdate().toDateString()} and policy is '${policy}'`, async (): Promise<void> => {
      // Given
      const updatePolicy = policy as UpdatePolicy;
      // When
      const result = SUT.shouldUpdate(lastUpdate(), updatePolicy);

      // Then
      expect(result).toBe(true);
    });
  });

  [
    { lastUpdate: () => now, policy: 'never' },
    {
      lastUpdate: () => addDays(now, 0),
      policy: '1/d',
    },
    {
      lastUpdate: () => addDays(now, -1),
      policy: '1/w',
    },
    {
      lastUpdate: () => addDays(now, -5),
      policy: '1/w',
    },
    {
      lastUpdate: () => addDays(now, -15),
      policy: '1/m',
    },
  ].forEach(({ lastUpdate, policy }: { lastUpdate: () => Date; policy: string }): void => {
    test(`should not update when lastUpdate is ${lastUpdate().toDateString()} and policy is '${policy}'`, async (): Promise<void> => {
      // Given
      const updatePolicy = policy as UpdatePolicy;
      // When
      const result = SUT.shouldUpdate(lastUpdate(), updatePolicy);

      // Then
      expect(result).toBe(false);
    });
  });
});
