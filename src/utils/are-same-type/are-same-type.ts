export function areSameType(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (isValueType(obj1)) {
    return areSameValueType(obj1, obj2);
  }

  if (isFunctionType(obj1)) {
    return areBothFunctions(obj1, obj2);
  }

  if (Array.isArray(obj1)) {
    return areEquivalentArray(obj1, obj2);
  }

  if (areSameTypeOfObjects(obj1, obj2)) {
    return true;
  }

  return false;
}

export function areEquivalentArray(obj1: unknown[], obj2: unknown[] | unknown): boolean {
  if (!Array.isArray(obj2)) {
    return false;
  }
  const length1 = obj1.length;
  const length2 = obj2.length;
  const length = Math.min(length1, length2);
  for (let i = 0; i < length; i++) {
    const isItemTypeFoundInSecondArray = obj2.some((item) => areSameType(obj1[i], item));
    if (!isItemTypeFoundInSecondArray) {
      return false;
    }
  }
  return true;
}

export function isValueType(obj: unknown): boolean {
  return (
    typeof obj === 'number' ||
    typeof obj === 'string' ||
    typeof obj === 'boolean' ||
    obj === null ||
    obj === undefined
  );
}

export function isFunctionType(obj: unknown): boolean {
  return typeof obj === 'function';
}

export function areBothFunctions(obj1: unknown, obj2: unknown): boolean {
  return isFunctionType(obj1) && isFunctionType(obj2);
}

export function areSameValueType(value1: unknown, value2: unknown): boolean {
  if (value1 === null && value2 === null) {
    return true;
  }

  if (value1 === undefined && value2 === undefined) {
    return true;
  }

  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return true;
  }

  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return true;
  }

  if (typeof value1 === 'boolean' && typeof value2 === 'boolean') {
    return true;
  }

  return false;
}

export function areSameTypeOfObjects(obj1: unknown, obj2: unknown): boolean {
  if (typeof obj1 === 'object' && typeof obj2 !== 'object') {
    return false;
  }
  if (typeof obj1 !== 'object' && typeof obj2 === 'object') {
    return false;
  }

  const obj1Properties = Object.getOwnPropertyNames(obj1);
  const obj2Properties = Object.getOwnPropertyNames(obj2);

  if (obj1Properties.length !== obj2Properties.length) {
    return false;
  }

  for (let index = 0; index < obj1Properties.length; index++) {
    const key = obj1Properties[index];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child1 = (obj1 as any)[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child2 = (obj2 as any)[key];
    if (!areSameType(child1, child2)) {
      return false;
    }
  }

  return true;
}
