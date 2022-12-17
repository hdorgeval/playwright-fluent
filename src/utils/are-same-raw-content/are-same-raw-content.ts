export function areSameRawContent(content1: string, content2: string): boolean {
  const raw1 = content1.replace(/(?:\r\n|\r|\n|\s)/g, '');
  const raw2 = content2.replace(/(?:\r\n|\r|\n|\s)/g, '');

  // eslint-disable-next-line no-console
  console.log(`content1='${content1}'  content2='${content2}'`);
  // eslint-disable-next-line no-console
  console.log(`raw1='${raw1}'  raw2='${raw2}'`);

  if (raw1 === raw2) {
    return true;
  }

  return false;
}
