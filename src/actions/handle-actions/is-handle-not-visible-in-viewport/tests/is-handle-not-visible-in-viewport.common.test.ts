import { ElementHandle } from 'playwright';
import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';

describe('handle is not visible in viewport', (): void => {
  beforeEach((): void => {});

  test('should return true when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(true);
  });

  test('should return true when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleNotVisibleInViewport(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(true);
  });
});
