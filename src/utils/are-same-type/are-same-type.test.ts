import * as SUT from './index';

describe('are same type of objects', (): void => {
  [
    { obj1: [], obj2: [] },
    { obj1: [undefined], obj2: [undefined] },
    { obj1: [null], obj2: [null] },
    { obj1: [], obj2: [true] },
    { obj1: [], obj2: [1, 2] },
    { obj1: [1, 2], obj2: [] },
    { obj1: [1, 2, 3], obj2: [4, 5] },
    { obj1: ['1', '2', '3'], obj2: ['4', '5'] },
    { obj1: [true, false, true], obj2: [false, true] },
    { obj1: [{ prop1: 1 }], obj2: [{ prop1: 2 }] },
    { obj1: [{ prop1: 1 }], obj2: [] },
    { obj1: [], obj2: [{ prop1: 2 }] },
    {
      obj1: [{ prop1: 1 }, { prop1: 1, prop2: true }],
      obj2: [{ prop1: 2, prop2: false }, { prop1: 2 }],
    },
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
    { obj1: [1, 2, 3], obj2: undefined },
    { obj1: [1, 2, 3], obj2: [undefined, undefined, undefined] },
    { obj1: [null, null, null], obj2: [undefined, undefined, undefined] },
    { obj1: [undefined, undefined, undefined], obj2: [1, 2, 3] },
    { obj1: [1, 2, 3], obj2: [null] },
    { obj1: [null], obj2: [1, 2, 3] },
    { obj1: [1, 2, 3], obj2: null },
    { obj1: [1, 2, 3], obj2: ['1', '2', '3'] },
    { obj1: ['1', '2', '3'], obj2: [1, 2, 3] },
    { obj1: [true, false, true], obj2: [1, 0, 1] },
    { obj1: [{ prop1: 1 }], obj2: [{ prop2: 1 }] },
    { obj1: [{ prop1: 1 }], obj2: [{ prop1: null }] },
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
    { obj1: null, obj2: null },
    { obj1: undefined, obj2: undefined },
    { obj1: {}, obj2: {} },
    { obj1: { prop1: {} }, obj2: { prop1: {} } },
    { obj1: { prop1: null }, obj2: { prop1: null } },
    { obj1: { prop1: undefined }, obj2: { prop1: undefined } },
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
    { obj1: { prop1: undefined }, obj2: null },
    { obj1: { prop1: undefined }, obj2: undefined },
    { obj1: { prop1: null }, obj2: null },
    { obj1: { prop1: null }, obj2: undefined },
    { obj1: { prop1: null }, obj2: {} },
    { obj1: { prop1: null }, obj2: { prop1: undefined } },
    { obj2: { prop1: null }, obj1: { prop1: undefined } },
    { obj1: { prop1: 1 }, obj2: { prop1: '2' } },
    { obj1: { prop1: 1 }, obj2: { prop1: true } },
    { obj1: { prop1: 1 }, obj2: { prop1: () => 1 } },
    { obj2: { prop1: 1 }, obj1: { prop1: () => 1 } },
    { obj1: { prop1: [1, 2, 3] }, obj2: { prop1: [true, false, false] } },
    { obj1: { prop1: { child1: 1 } }, obj2: { prop1: { child2: 1 } } },
    { obj1: { prop1: { child1: 1 } }, obj2: { prop1: { child1: true } } },
    { obj1: { prop1: { child1: 1 } }, obj2: { prop1: { child1: '1' } } },
    { obj1: { prop1: { child1: 0 } }, obj2: { prop1: { child1: false } } },
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

  // dictionaries
  [
    {
      obj1: {
        '1556:112EC:91CC0D:95482B:60918218': 'foo',
        '1556:112EC:91CC0D:95482B:60918218:1': 'bar',
      },
      obj2: {
        '1557:112EC:91CC0D:95482B:60918219:1': 'baz',
      },
    },
    {
      obj1: {
        '3cba286c42c9cb92a4948556a82dcc3e': 'foo',
        '3cba286c42c9cf92a4948556a82dcc3f': 'bar',
      },
      obj2: {
        '3cba286c42c9df92b4948556a82dcc3f': 'baz',
      },
    },
    {
      obj1: {
        'a67644d7-8e3d-43b7-a3b5-adf838189224': 'foo',
        'b67644d7-8e3d-43b7-a3b5-adf838189224': 'bar',
      },
      obj2: {
        'a67644d7-8e3d-43b7-a3b5-adf838189224': 'baz',
      },
    },
    {
      obj1: {
        '62ABD963-18F0-493F-81B1-179D176A2282': 'foo',
        '72ABD963-18F0-493F-81B1-179D176A2282': 'bar',
      },
      obj2: {
        '82ABD963-18F0-493F-81B1-179D176A2282': 'baz',
      },
    },
    {
      obj1: {
        '555F2A76E3ED45709DF98B04F0574FF9': 'foo',
        '655F2A76E3ED45709DF98B04F0574FF9': 'bar',
      },
      obj2: {
        '755F2A76E3ED45709DF98B04F0574FF9': 'baz',
      },
    },
    {
      obj1: {
        'ARTp5OrcsEKF6kjkRu6NEg==': 'foo',
        'BRTp5OrcsEKF6kjkRu6NEg==': 'bar',
      },
      obj2: {
        'CRTp5OrcsEKF6kjkRu6NEg==': 'baz',
      },
    },
  ].forEach(({ obj1, obj2 }) => {
    test(`should detect that dictionary '${JSON.stringify(
      obj1,
    )}' is equivalent to '${JSON.stringify(obj2)}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameType(obj1, obj2);

      // Then
      expect(result).toBe(true);
    });
  });

  // dictionaries
  [
    {
      obj1: {
        '3cba286c42c9cb92a4948556a82dcc3e': 'foo',
        '3cba286c42c9cf92a4948556a82dcc3f': 'bar',
      },
      obj2: null,
    },
    {
      obj1: {
        '3cba286c42c9cb92a4948556a82dcc3e': 'foo',
        '3cba286c42c9cf92a4948556a82dcc3f': 'bar',
      },
      obj2: undefined,
    },
  ].forEach(({ obj1, obj2 }) => {
    test(`should detect that dictionary '${JSON.stringify(
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
