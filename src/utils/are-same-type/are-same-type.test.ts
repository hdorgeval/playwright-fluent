import * as SUT from './index';

describe('are same type of objects', (): void => {
  [
    { obj1: [], obj2: [] },
    { obj1: [], obj2: [true] },
    { obj1: [], obj2: [1, 2] },
    { obj1: [1, 2], obj2: [] },
    { obj1: [1, 2, 3], obj2: [4, 5] },
    { obj1: ['1', '2', '3'], obj2: ['4', '5'] },
    { obj1: [true, false, true], obj2: [false, true] },
    { obj1: [{ prop1: 1 }], obj2: [{ prop1: 2 }] },
  ].forEach(({ obj1, obj2 }) => {
    test(`should detect that array '${JSON.stringify(obj1)}' is equivalent to '${JSON.stringify(
      obj2,
    )}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameType(obj1, obj2);

      // Then
      expect(result).toBe(true);
    });
  });

  [
    { obj1: [1, 2, 3], obj2: ['1', '2', '3'] },
    { obj1: ['1', '2', '3'], obj2: [1, 2, 3] },
    { obj1: [true, false, true], obj2: [1, 0, 1] },
    { obj1: [{ prop1: 1 }], obj2: [{ prop2: 1 }] },
  ].forEach(({ obj1, obj2 }) => {
    test(`should detect that array '${JSON.stringify(obj1)}' is not equivalent to '${JSON.stringify(
      obj2,
    )}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameType(obj1, obj2);

      // Then
      expect(result).toBe(false);
    });
  });

  [
    { obj1: {}, obj2: {} },
    { obj1: { prop1: {} }, obj2: { prop1: {} } },
    { obj1: { prop1: null }, obj2: { prop1: null } },
    { obj1: { prop1: 1 }, obj2: { prop1: 2 } },
    { obj1: { prop1: true }, obj2: { prop1: false } },
    { obj1: { prop1: 'a' }, obj2: { prop1: 'b' } },
    { obj1: { prop1: [1, 2, 3] }, obj2: { prop1: [4, 5] } },
    { obj1: { prop1: ['1', '2', '3'] }, obj2: { prop1: ['4', '5'] } },
    { obj1: { prop1: { child1: 1 } }, obj2: { prop1: { child1: 2 } } },
    { obj1: { prop1: { child1: [1, 2, 3] } }, obj2: { prop1: { child1: [4, 5] } } },
  ].forEach(({ obj1, obj2 }) => {
    test(`should detect that object '${JSON.stringify(obj1)}' is equivalent to '${JSON.stringify(
      obj2,
    )}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameType(obj1, obj2);

      // Then
      expect(result).toBe(true);
    });
  });

  [
    { obj1: { prop1: null }, obj2: { prop1: undefined } },
    { obj2: { prop1: null }, obj1: { prop1: undefined } },
    { obj1: { prop1: 1 }, obj2: { prop1: '2' } },
    { obj1: { prop1: 1 }, obj2: { prop1: true } },
    { obj1: { prop1: 1 }, obj2: { prop1: () => 1 } },
    { obj2: { prop1: 1 }, obj1: { prop1: () => 1 } },
    { obj1: { prop1: [1, 2, 3] }, obj2: { prop1: [true, false, false] } },
    { obj1: { prop1: { child1: 1 } }, obj2: { prop1: { child2: 1 } } },
    { obj1: { prop1: { child1: 1 } }, obj2: { prop1: { child1: true } } },
  ].forEach(({ obj1, obj2 }) => {
    test(`should detect that object '${JSON.stringify(
      obj1,
    )}' is not equivalent to '${JSON.stringify(obj2)}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameType(obj1, obj2);

      // Then
      expect(result).toBe(false);
    });
  });
});
