import { getChromePath } from '../get-chrome-path';
import { fileExists } from '../../fs';

describe('get-chrome-path in real env', (): void => {
  test('should return path in real env', (): void => {
    // Given

    // When
    const chromePath = getChromePath();

    // Then
    // eslint-disable-next-line no-console
    console.log(`Chrome path: '${chromePath}'`);
    expect(fileExists(chromePath)).toBe(true);
  });
});
