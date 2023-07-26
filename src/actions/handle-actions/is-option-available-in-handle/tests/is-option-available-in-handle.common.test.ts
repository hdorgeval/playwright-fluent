import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('is option available in handle', (): void => {
  beforeEach((): void => {});
  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isOptionAvailableInHandle(handle, 'foo', 'bar');

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isOptionAvailableInHandle(handle, 'foo', 'bar');

    // Then
    expect(result).toBe(false);
  });
});
