import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('get class list of handle', (): void => {
  beforeEach((): void => {});

  test('should return an empty array when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should return an empty array when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.getClassListOfHandle(handle);

    // Then
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
