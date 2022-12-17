import * as SUT from './index';

describe('are same raw content', (): void => {
  [
    { content1: '', content2: '' },
    { content1: ' ', content2: '' },
    { content1: '', content2: ' ' },
    { content1: '\t', content2: '  ' },
    { content1: '\t', content2: '        ' },
    { content1: '\t', content2: '' },
    { content1: 'foo', content2: 'foo' },
    { content1: 'foo', content2: '\tfoo ' },
    { content1: 'foo', content2: 'foo\r\n' },
    { content1: 'foo\n', content2: 'foo\r\n' },
    { content1: 'foo\r\n', content2: 'foo\n\r' },
    { content1: 'foo\r', content2: 'foo\n' },
    { content1: 'foo\nbar\n', content2: 'foo\r\nbar\r\n' },
    { content1: 'foo\nbar\n', content2: 'foo\r\nbar\r\n' },
    { content1: 'foo\nbar\nbaz', content2: 'foo\r\nbar\r\nbaz\r\n' },
    { content1: 'foo\nbar\nbaz', content2: ' foo\r\n\tbar\r\n   baz\r\n' },
  ].forEach(({ content1, content2 }) => {
    test(`should detect that string '${content1}' is same as to '${content2}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameRawContent(content1, content2);

      // Then
      expect(result).toBe(true);
    });
  });
  [
    { content1: 'foo', content2: 'bar' },
    { content1: 'foo', content2: 'foobar' },
    { content1: '\tfoo', content2: '\tbar' },
    { content1: 'foo\n', content2: 'bar\r\n' },
  ].forEach(({ content1, content2 }) => {
    test(`should detect that string '${content1}' is not the same as '${content2}'`, async (): Promise<void> => {
      // Given

      // When
      const result = SUT.areSameRawContent(content1, content2);

      // Then
      expect(result).toBe(false);
    });
  });
});
