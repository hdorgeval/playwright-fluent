import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('is option by value available in handle', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isOptionByValueAvailableInHandle(handle, 'foo', 'bar');

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isOptionByValueAvailableInHandle(handle, 'foo', 'bar');

    // Then
    expect(result).toBe(false);
  });
});
