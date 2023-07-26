import { ElementHandle } from 'playwright';
import * as SUT from '../index';

describe('handle does notexists', (): void => {
  beforeEach((): void => {});

  test('should return true when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.handleDoesNotExist(handle);

    // Then
    expect(result).toBe(true);
  });

  test('should return true when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.handleDoesNotExist(handle);

    // Then
    expect(result).toBe(true);
  });
});
