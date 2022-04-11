import path from 'path';
import * as SUT from '../index';
import { HarEntry } from '../index';

describe('har-writer', (): void => {
  test('should reduce HAR file', async (): Promise<void> => {
    // Given
    const inputFile = path.join(__dirname, 'github.com.har');
    const outputFile = path.join(__dirname, 'github-reduced.har');
    const entryFilter = (entry: HarEntry): boolean => {
      if (entry.request.method === 'POST') {
        return true;
      }
      return false;
    };
    // When
    SUT.reduceHarFile({ inputFile, outputFile, entryFilter });

    // Then
  });
});
