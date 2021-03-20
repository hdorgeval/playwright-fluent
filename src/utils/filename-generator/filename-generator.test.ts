import * as SUT from './index';

describe('filename generator', (): void => {
  test('should generate uniqe filenames when no options', async (): Promise<void> => {
    // Given
    const filenames = new Set();
    const count = 100;

    // When
    for (let index = 1; index <= count; index++) {
      filenames.add(SUT.uniqueFilename());
    }

    // Then
    expect(filenames.size).toBe(100);
  });
  test('should generate uniqe filenames with prefix', async (): Promise<void> => {
    // Given
    const filenames = new Set<string>();
    const count = 100;
    const prefix = 'har-';

    // When
    for (let index = 1; index <= count; index++) {
      filenames.add(SUT.uniqueFilename({ prefix }));
    }

    // Then
    expect(filenames.size).toBe(100);
    filenames.forEach((filename) => {
      expect(filename.startsWith(prefix)).toBe(true);
      expect(filename.endsWith('.json')).toBe(true);
    });
  });

  test('should generate uniqe filenames with prefix and extension', async (): Promise<void> => {
    // Given
    const filenames = new Set<string>();
    const count = 100;
    const prefix = 'har-';
    const extension = '.foobar';

    // When
    for (let index = 1; index <= count; index++) {
      filenames.add(SUT.uniqueFilename({ prefix, extension }));
    }

    // Then
    expect(filenames.size).toBe(100);
    filenames.forEach((filename) => {
      expect(filename.startsWith(prefix)).toBe(true);
      expect(filename.endsWith(extension)).toBe(true);
    });
  });
});
