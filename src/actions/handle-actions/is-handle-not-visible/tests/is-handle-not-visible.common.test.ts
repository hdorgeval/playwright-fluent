import * as SUT from '../index';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { ElementHandle } from 'playwright';

describe('handle is not visible', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return true when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(true);
  });

  test('should return true when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.isHandleNotVisible(handle, defaultVerboseOptions);

    // Then
    expect(result).toBe(true);
  });
});
