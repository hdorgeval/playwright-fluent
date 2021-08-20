import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { ElementHandle } from 'playwright';

describe('handle is unchecked', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleUnchecked(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(false);
  });
});
