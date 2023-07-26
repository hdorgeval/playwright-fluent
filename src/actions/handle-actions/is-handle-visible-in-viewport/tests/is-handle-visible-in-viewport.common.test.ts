import { ElementHandle } from 'playwright';
import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';

describe('handle is visible in viewport', (): void => {
  beforeEach((): void => {});

  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(false);
  });
});
