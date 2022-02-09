export function areSameType(obj1: unknown, obj2: unknown): boolean {
  if (isValueType(obj1)) {
    return areSameValueType(obj1, obj2);
  }

  if (isFunctionType(obj1)) {
    return areBothFunctions(obj1, obj2);
  }

  if (Array.isArray(obj1)) {
    return areEquivalentArray(obj1, obj2);
  }

  if (isDictionaryType(obj1)) {
    return areEquivalentDictionary(obj1, obj2);
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

export function areEquivalentDictionary(obj1: unknown, obj2: unknown): boolean {
  if (!isDictionaryType(obj2)) {
    return false;
  }

  const obj1AsArray = toArray(obj1);
  const obj2AsArray = toArray(obj2);
  return areEquivalentArray(obj1AsArray, obj2AsArray);
}

export function toArray(obj: unknown): unknown[] {
  const keys = Object.getOwnPropertyNames(obj);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return keys.map((key) => (obj as any)[key]);
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

export function isDictionaryType(obj: unknown): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }

  const objProperties = Object.getOwnPropertyNames(obj);

  if (objProperties.length === 0) {
    return false;
  }

  for (let index = 0; index < objProperties.length; index++) {
    const key = objProperties[index];
    if (isId(`${key}`)) {
      return true;
    }
  }

  return false;
}

const idsRegex = [
  /[0-9]{4}[:][A-Z0-9]{5}/,
  // etag
  /[0-9a-zA-Z]{30}/,
  // base64
  /[0-9a-zA-Z]{20,}==$/,
  // guid
  /[a-zA-Z0-9]{8}[-][a-zA-Z0-9]{4}[-][a-zA-Z0-9]{4}/,
];
export function isId(key: string): boolean {
  return idsRegex.some((regex) => regex.test(key));
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

  if (obj2 === null || obj2 === undefined) {
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
