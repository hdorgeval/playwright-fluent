export function areSameRawContent(
  content1: string | undefined | null,
  content2: string | undefined | null,
): boolean {
  if (content1 === undefined && content2 === undefined) {
    return true;
  }

  if (content1 === null && content2 === null) {
    return true;
  }

  if (content1 === undefined || content2 === undefined) {
    return false;
  }

  if (content1 === null || content2 === null) {
    return false;
  }

  if (typeof content1 !== 'string') {
    throw new Error(`First parameter should be a string, but it is a ${typeof content1}`);
  }

  if (typeof content2 !== 'string') {
    throw new Error(`Second parameter should be a string, but it is a ${typeof content2}`);
  }

  const raw1 = content1.replace(/(?:\r\n|\r|\n|\s)/g, '');
  const raw2 = content2.replace(/(?:\r\n|\r|\n|\s)/g, '');

  if (raw1 === raw2) {
    return true;
  }

  return false;
}
