import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { ElementHandle } from 'playwright';

describe('handle is not visible in viewport', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
